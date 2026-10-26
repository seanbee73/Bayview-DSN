/**
 * Audio processing utilities for Gemini Live API (gemini-3.8-live)
 * Fully compatible with Mobile iOS Safari, Android Chrome, and Desktop browsers.
 */

export const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);
};

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

/**
 * Encodes 16-bit PCM byte array into a standard RIFF/WAV container.
 * Natively playable on all mobile browsers (iOS Safari, Android Chrome).
 */
export function pcmToWav(pcmData: Uint8Array, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): ArrayBuffer {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + pcmData.length);
  const view = new DataView(buffer);

  function writeString(v: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      v.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmData.length, true);
  writeString(view, 8, 'WAVE');

  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // Linear PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  writeString(view, 36, 'data');
  view.setUint32(40, pcmData.length, true);

  new Uint8Array(buffer, 44).set(pcmData);
  return buffer;
}

/**
 * Resamples input audio from hardware sample rate (e.g. 44.1kHz or 48kHz on mobile)
 * down to 16kHz required by Gemini Live API.
 */
export function downsampleTo16k(input: Float32Array, inputSampleRate: number): Float32Array {
  if (inputSampleRate === 16000) return input;
  const ratio = inputSampleRate / 16000;
  const newLength = Math.round(input.length / ratio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetInput = 0;

  while (offsetResult < result.length) {
    const nextOffsetInput = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let i = offsetInput; i < nextOffsetInput && i < input.length; i++) {
      accum += input[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetInput = nextOffsetInput;
  }
  return result;
}

/**
 * Converts 24kHz 16-bit PCM little-endian from Gemini Live into an AudioBuffer.
 * AudioContext natively resamples from 24kHz to hardware output rate (44.1kHz / 48kHz).
 */
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
  onTranscript: (item: { role: 'user' | 'assistant'; text: string; audioUrl?: string }) => void;
  onTurnComplete?: () => void;
  onAudioLevel?: (userLevel: number, aiLevel: number) => void;
  onMicStatusChange?: (hasMic: boolean, reason?: string) => void;
  onAudioReady?: (audioUrl: string) => void;
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
  private pingIntervalId: any = null;
  private isSpeaking = false;
  private hasMic = false;
  private pendingTextQueue: string[] = [];
  private currentVoice = 'Zephyr';

  // Mobile HTML5 Audio fallback player
  private htmlAudio: HTMLAudioElement | null = null;
  private currentTurnChunks: Uint8Array[] = [];
  private currentTurnText = '';
  private playedViaWebAudio = false;

  constructor(callbacks: LiveVoiceCallbacks) {
    this.callbacks = callbacks;
    this.initHtmlAudio();
  }

  private initHtmlAudio() {
    if (typeof window !== 'undefined') {
      try {
        this.htmlAudio = new Audio();
        this.htmlAudio.preload = 'auto';
      } catch (e) {
        // ignore
      }
    }
  }

  public async connect(voice: string = 'Zephyr') {
    this.currentVoice = voice;
    try {
      this.callbacks.onStatusChange('connecting');

      // Initialize audio context without forcing custom sampleRate (safe on iOS Safari)
      this.initOutputAudio();

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live?voice=${encodeURIComponent(voice)}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        // Keep alive ping every 20s for mobile carrier connections
        if (this.pingIntervalId) clearInterval(this.pingIntervalId);
        this.pingIntervalId = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 20000);
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'connected') {
            this.callbacks.onStatusChange('connected');

            // Send any queued text messages
            while (this.pendingTextQueue.length > 0) {
              const text = this.pendingTextQueue.shift();
              if (text && this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: 'text', text }));
              }
            }
          } else if (msg.type === 'audio' && msg.audio) {
            this.handleIncomingAudio(msg.audio);
          } else if (msg.type === 'transcript') {
            if (msg.role === 'assistant') {
              this.currentTurnText += (this.currentTurnText ? ' ' : '') + msg.text;
            }
            this.callbacks.onTranscript({ role: msg.role, text: msg.text });
          } else if (msg.type === 'text' && msg.text) {
            this.currentTurnText += (this.currentTurnText ? ' ' : '') + msg.text;
            this.callbacks.onTranscript({ role: 'assistant', text: msg.text });
          } else if (msg.type === 'interrupted') {
            this.handleInterruption();
          } else if (msg.type === 'turnComplete') {
            this.finalizeTurnAudio();
            this.isSpeaking = false;
            this.callbacks.onTurnComplete?.();
            this.callbacks.onStatusChange(this.hasMic ? 'listening' : 'connected');
          } else if (msg.type === 'error') {
            console.warn('Live API warning/error:', msg.error);
            this.callbacks.onError(msg.error || 'Voice session error');
          }
        } catch (e) {
          console.error('Error handling WebSocket message:', e);
        }
      };

      this.ws.onerror = () => {
        console.warn('WebSocket connection error, enabling fallback mode');
        this.callbacks.onStatusChange('connected');
      };

      this.ws.onclose = () => {
        if (this.pingIntervalId) {
          clearInterval(this.pingIntervalId);
          this.pingIntervalId = null;
        }
      };
    } catch (err: any) {
      console.error('Error in connect:', err);
      this.callbacks.onStatusChange('connected');
    }
  }

  /**
   * Safe AudioContext initialization without custom sampleRate to avoid iOS Safari NotSupportedError.
   */
  private initOutputAudio() {
    try {
      if (!this.outputAudioCtx || this.outputAudioCtx.state === 'closed') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.outputAudioCtx = new AudioCtx();
          this.outputAnalyser = this.outputAudioCtx.createAnalyser();
          this.outputAnalyser.fftSize = 64;
        }
      }
    } catch (e) {
      console.warn('Could not initialize output AudioContext:', e);
    }
  }

  /**
   * Pre-activates audio on mobile touch/click events (unlocks iOS Safari AudioContext & HTML5 audio).
   */
  public unlockAudio() {
    this.initOutputAudio();

    if (this.outputAudioCtx && this.outputAudioCtx.state === 'suspended') {
      this.outputAudioCtx.resume().catch(() => {});
    }

    if (this.htmlAudio) {
      try {
        // Unlock HTML5 Audio with 1 silent sample
        this.htmlAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
        this.htmlAudio.play().then(() => {
          this.htmlAudio?.pause();
        }).catch(() => {});
      } catch (e) {
        // ignore
      }
    }
  }

  public async requestMicrophone(): Promise<boolean> {
    this.unlockAudio();
    return this.startMicGraceful(true);
  }

  private async startMicGraceful(explicitUserAction = false): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.hasMic = false;
        this.callbacks.onMicStatusChange?.(false, 'Microphone is not available in this browser.');
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.mediaStream = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioCtx = new AudioCtx();
      this.inputAnalyser = this.inputAudioCtx.createAnalyser();
      this.inputAnalyser.fftSize = 64;

      const source = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
      this.processor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);

      // Mute gain node to prevent microphone feedback into mobile speakers
      const muteGain = this.inputAudioCtx.createGain();
      muteGain.gain.value = 0;

      source.connect(this.inputAnalyser);
      this.inputAnalyser.connect(this.processor);
      this.processor.connect(muteGain);
      muteGain.connect(this.inputAudioCtx.destination);

      const hardwareRate = this.inputAudioCtx.sampleRate;

      this.processor.onaudioprocess = (e) => {
        // Prevent acoustic feedback echo: silence microphone while AI is speaking
        if (this.isMuted || this.isSpeaking) return;
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const resampled = downsampleTo16k(inputData, hardwareRate);
        const pcm16 = floatTo16BitPCM(resampled);
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
        ? 'Microphone input is restricted in this browser or iframe. You can type or tap suggested questions below to converse with Gemini 3.8 Live and hear real-time audio.'
        : 'Microphone is currently unavailable. You can type or tap questions to converse with Gemini 3.8 Live.';

      this.callbacks.onMicStatusChange?.(false, message);
      this.callbacks.onStatusChange('connected');
      this.startMeterLoop();
      return false;
    }
  }

  private handleIncomingAudio(base64Pcm: string) {
    this.initOutputAudio();
    this.isSpeaking = true;
    this.callbacks.onStatusChange('speaking');

    try {
      const arrayBuffer = base64ToArrayBuffer(base64Pcm);
      // Collect PCM bytes for HTML5 WAV player
      this.currentTurnChunks.push(new Uint8Array(arrayBuffer));

      // Stream progressive chunks via Web Audio
      if (this.outputAudioCtx) {
        if (this.outputAudioCtx.state === 'suspended') {
          this.outputAudioCtx.resume().catch(() => {});
        }

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
          this.nextStartTime = currentTime + 0.03;
        }

        source.start(this.nextStartTime);
        this.nextStartTime += audioBuffer.duration;
        this.playedViaWebAudio = true;

        this.activeSources.push(source);
        source.onended = () => {
          const idx = this.activeSources.indexOf(source);
          if (idx !== -1) this.activeSources.splice(idx, 1);
        };
      }
    } catch (err) {
      console.error('Error playing incoming audio chunk:', err);
    }
  }

  /**
   * Finalizes audio for the assistant turn into a playable WAV Blob URL.
   * Passes audioUrl for on-demand playback without duplicate auto-playback.
   */
  private finalizeTurnAudio() {
    if (this.currentTurnChunks.length === 0) return;

    try {
      const totalLength = this.currentTurnChunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const mergedPcm = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of this.currentTurnChunks) {
        mergedPcm.set(chunk, offset);
        offset += chunk.length;
      }

      const wavBuffer = pcmToWav(mergedPcm, 24000);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);

      this.callbacks.onAudioReady?.(audioUrl);

      // Reset chunks and flags for next turn
      this.playedViaWebAudio = false;
      this.currentTurnChunks = [];
      this.currentTurnText = '';
    } catch (e) {
      console.error('Error finalizing turn audio:', e);
    }
  }

  public playAudioUrl(url: string) {
    this.handleInterruption();
    if (this.htmlAudio) {
      this.htmlAudio.src = url;
      this.htmlAudio.currentTime = 0;
      this.htmlAudio.play().catch(() => {});
    }
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
    this.currentTurnChunks = [];
    this.currentTurnText = '';
    if (this.htmlAudio) {
      try {
        this.htmlAudio.pause();
      } catch (e) {}
    }
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

      if (this.outputAnalyser && (this.activeSources.length > 0 || (this.htmlAudio && !this.htmlAudio.paused))) {
        const data = new Uint8Array(this.outputAnalyser.frequencyBinCount);
        this.outputAnalyser.getByteFrequencyData(data);
        const sum = data.reduce((a, b) => a + b, 0);
        aiLevel = Math.min(100, Math.max(30, Math.round((sum / data.length / 255) * 100)));
      }

      this.callbacks.onAudioLevel?.(userLevel, aiLevel);
      this.animationFrameId = requestAnimationFrame(checkLevels);
    };

    this.animationFrameId = requestAnimationFrame(checkLevels);
  }

  public async sendTextMessage(text: string) {
    this.unlockAudio();
    this.currentTurnChunks = [];
    this.currentTurnText = '';
    this.callbacks.onTranscript({ role: 'user', text });

    // If WebSocket is open, send to Gemini Live API
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'text', text }));
      return;
    }

    // If WebSocket is connecting, queue it
    if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
      this.pendingTextQueue.push(text);
      return;
    }

    // HTTP Fallback if WebSocket is closed
    try {
      this.callbacks.onStatusChange('speaking');
      const response = await fetch('/api/gemini/converse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      if (data.text) {
        this.callbacks.onTranscript({ role: 'assistant', text: data.text });
        this.speakWithSpeechSynthesis(data.text);
      }
      this.callbacks.onStatusChange('connected');
    } catch (e) {
      console.error('Fallback converse failed:', e);
      this.callbacks.onStatusChange('connected');
    }
  }

  private speakWithSpeechSynthesis(text: string) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        // ignore
      }
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

    if (this.pingIntervalId) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
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
