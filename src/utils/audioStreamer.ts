/**
 * Audio processing utilities for Gemini Live API (gemini-3.8-live)
 * - Input mic: 16kHz raw 16-bit PCM little-endian
 * - Model output: 24kHz raw 16-bit PCM little-endian
 */

export function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new DataView(new ArrayBuffer(input.length * 2));
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return output.buffer;
}

export function base64EncodeAudio(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function pcm16ToAudioBuffer(arrayBuffer: ArrayBuffer, audioCtx: AudioContext): AudioBuffer {
  const dataView = new DataView(arrayBuffer);
  const numSamples = Math.floor(arrayBuffer.byteLength / 2);
  const audioBuffer = audioCtx.createBuffer(1, numSamples, 24000);
  const channelData = audioBuffer.getChannelData(0);

  for (let i = 0; i < numSamples; i++) {
    const int16 = dataView.getInt16(i * 2, true);
    channelData[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
  }

  return audioBuffer;
}

export interface LiveVoiceCallbacks {
  onStatusChange: (status: 'disconnected' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error') => void;
  onTranscript: (item: { role: 'user' | 'assistant'; text: string }) => void;
  onAudioLevel?: (userLevel: number, aiLevel: number) => void;
  onMicStatusChange?: (hasMic: boolean, reason?: string) => void;
  onError: (error: string) => void;
  onInterrupted?: () => void;
}

export class LiveVoiceSession {
  private ws: WebSocket | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private inputAnalyser: AnalyserNode | null = null;
  private outputAnalyser: AnalyserNode | null = null;
  private activeSources: AudioBufferSourceNode[] = [];
  private nextStartTime = 0;
  private isMuted = false;
  private callbacks: LiveVoiceCallbacks;
  private animationFrameId: number | null = null;
  private isSpeaking = false;
  private hasMic = false;

  constructor(callbacks: LiveVoiceCallbacks) {
    this.callbacks = callbacks;
  }

  public async connect(voice: string = 'Zephyr') {
    try {
      this.callbacks.onStatusChange('connecting');

      // Initialize output audio context for playback
      this.initOutputAudio();

      // Setup WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live?voice=${encodeURIComponent(voice)}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        // Connected to server socket
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'connected') {
            this.callbacks.onStatusChange('connected');
            // Try starting mic gracefully without breaking session if denied
            this.startMicGraceful();
          } else if (msg.type === 'audio' && msg.audio) {
            this.handleIncomingAudio(msg.audio);
          } else if (msg.type === 'transcript') {
            this.callbacks.onTranscript({ role: msg.role, text: msg.text });
          } else if (msg.type === 'interrupted') {
            this.handleInterruption();
          } else if (msg.type === 'turnComplete') {
            this.isSpeaking = false;
            this.callbacks.onStatusChange(this.hasMic ? 'listening' : 'connected');
          } else if (msg.type === 'error') {
            this.callbacks.onError(msg.error || 'Live session error');
            this.callbacks.onStatusChange('error');
          }
        } catch (e) {
          console.error('Error handling WebSocket message:', e);
        }
      };

      this.ws.onerror = () => {
        this.callbacks.onError('Could not connect to live voice server');
        this.callbacks.onStatusChange('error');
      };

      this.ws.onclose = () => {
        this.callbacks.onStatusChange('disconnected');
        this.cleanupAudio();
      };
    } catch (err: any) {
      console.error('Error connecting to Live API:', err);
      this.callbacks.onError(err.message || 'Failed to start voice connection');
      this.callbacks.onStatusChange('error');
    }
  }

  private initOutputAudio() {
    try {
      if (!this.outputAudioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.outputAudioCtx = new AudioCtx({ sampleRate: 24000 });
        this.outputAnalyser = this.outputAudioCtx.createAnalyser();
        this.outputAnalyser.fftSize = 64;
      }
    } catch (e) {
      console.warn('Could not initialize output AudioContext:', e);
    }
  }

  public async requestMicrophone(): Promise<boolean> {
    return this.startMicGraceful(true);
  }

  private async startMicGraceful(explicitUserAction = false): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.hasMic = false;
        this.callbacks.onMicStatusChange?.(false, 'Microphone API is not supported in this browser environment.');
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        },
      });

      this.mediaStream = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioCtx = new AudioCtx({ sampleRate: 16000 });
      this.inputAnalyser = this.inputAudioCtx.createAnalyser();
      this.inputAnalyser.fftSize = 64;

      const source = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
      this.processor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);

      source.connect(this.inputAnalyser);
      this.inputAnalyser.connect(this.processor);
      this.processor.connect(this.inputAudioCtx.destination);

      this.processor.onaudioprocess = (e) => {
        if (this.isMuted) return;
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = floatTo16BitPCM(inputData);
        const base64Audio = base64EncodeAudio(pcm16);

        this.ws.send(JSON.stringify({ type: 'audio', audio: base64Audio }));
      };

      this.hasMic = true;
      this.callbacks.onMicStatusChange?.(true);
      this.callbacks.onStatusChange('listening');
      this.startMeterLoop();
      return true;
    } catch (err: any) {
      this.hasMic = false;
      const isNotAllowed =
        err?.name === 'NotAllowedError' ||
        err?.message?.includes('not allowed') ||
        err?.message?.includes('Permission denied');

      const message = isNotAllowed
        ? 'Microphone permission is restricted in this browser or iframe context. You can still chat with Gemini 3.8 Live via text and hear real-time spoken audio responses.'
        : 'Microphone is currently unavailable. You can type or tap questions to converse with Gemini 3.8 Live.';

      this.callbacks.onMicStatusChange?.(false, message);
      this.callbacks.onStatusChange('connected');
      this.startMeterLoop();
      return false;
    }
  }

  public resumeAudioPlayback() {
    if (this.outputAudioCtx && this.outputAudioCtx.state === 'suspended') {
      this.outputAudioCtx.resume().catch(() => {});
    }
  }

  private handleIncomingAudio(base64Pcm: string) {
    this.initOutputAudio();
    if (!this.outputAudioCtx) return;

    if (this.outputAudioCtx.state === 'suspended') {
      this.outputAudioCtx.resume().catch(() => {});
    }

    this.isSpeaking = true;
    this.callbacks.onStatusChange('speaking');

    const arrayBuffer = base64ToArrayBuffer(base64Pcm);
    const audioBuffer = pcm16ToAudioBuffer(arrayBuffer, this.outputAudioCtx);

    const source = this.outputAudioCtx.createBufferSource();
    source.buffer = audioBuffer;

    if (this.outputAnalyser) {
      source.connect(this.outputAnalyser);
      this.outputAnalyser.connect(this.outputAudioCtx.destination);
    } else {
      source.connect(this.outputAudioCtx.destination);
    }

    const currentTime = this.outputAudioCtx.currentTime;
    if (this.nextStartTime < currentTime) {
      this.nextStartTime = currentTime + 0.04;
    }

    source.start(this.nextStartTime);
    this.nextStartTime += audioBuffer.duration;

    this.activeSources.push(source);
    source.onended = () => {
      const idx = this.activeSources.indexOf(source);
      if (idx !== -1) this.activeSources.splice(idx, 1);

      if (this.activeSources.length === 0 && !this.isSpeaking) {
        this.callbacks.onStatusChange(this.hasMic ? 'listening' : 'connected');
      }
    };
  }

  private handleInterruption() {
    for (const src of this.activeSources) {
      try {
        src.stop();
        src.disconnect();
      } catch (e) {
        // ignore
      }
    }
    this.activeSources = [];
    this.nextStartTime = 0;
    this.isSpeaking = false;
    this.callbacks.onInterrupted?.();
    this.callbacks.onStatusChange(this.hasMic ? 'listening' : 'connected');
  }

  private startMeterLoop() {
    if (this.animationFrameId !== null) return;

    const checkLevels = () => {
      let userLevel = 0;
      let aiLevel = 0;

      if (this.inputAnalyser && !this.isMuted && this.hasMic) {
        const data = new Uint8Array(this.inputAnalyser.frequencyBinCount);
        this.inputAnalyser.getByteFrequencyData(data);
        const sum = data.reduce((a, b) => a + b, 0);
        userLevel = Math.min(100, Math.round((sum / data.length / 255) * 100));
      }

      if (this.outputAnalyser && this.activeSources.length > 0) {
        const data = new Uint8Array(this.outputAnalyser.frequencyBinCount);
        this.outputAnalyser.getByteFrequencyData(data);
        const sum = data.reduce((a, b) => a + b, 0);
        aiLevel = Math.min(100, Math.round((sum / data.length / 255) * 100));
      }

      this.callbacks.onAudioLevel?.(userLevel, aiLevel);
      this.animationFrameId = requestAnimationFrame(checkLevels);
    };

    this.animationFrameId = requestAnimationFrame(checkLevels);
  }

  public sendTextMessage(text: string) {
    this.resumeAudioPlayback();
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'text', text }));
      this.callbacks.onTranscript({ role: 'user', text });
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getHasMic(): boolean {
    return this.hasMic;
  }

  public disconnect() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }

    this.cleanupAudio();
    this.callbacks.onStatusChange('disconnected');
  }

  private cleanupAudio() {
    this.handleInterruption();

    if (this.processor) {
      try {
        this.processor.disconnect();
      } catch (e) {}
      this.processor = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.inputAudioCtx) {
      try {
        this.inputAudioCtx.close();
      } catch (e) {}
      this.inputAudioCtx = null;
    }

    if (this.outputAudioCtx) {
      try {
        this.outputAudioCtx.close();
      } catch (e) {}
      this.outputAudioCtx = null;
    }
    this.hasMic = false;
  }
}
