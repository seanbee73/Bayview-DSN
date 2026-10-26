import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health & Status endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-live',
  });
});

// Salon information endpoint for client reference
app.get('/api/salon-info', (_req, res) => {
  res.json({
    name: 'Bayview Mall Creative Hair Dsn',
    location: 'Bayview-Cummer Shopping Centre, 3285 Bayview Ave, North York, ON M2K 0E6 (Floor 1)',
    phone: '(416) 221-2321',
    hours: 'Tue-Fri 9:00 AM - 6:30 PM, Sat 8:30 AM - 5:00 PM, Sun & Mon Closed',
    craftsmen: [
      { name: 'Joe', role: 'Master Barber', experience: '35+ years', specialty: 'Italian scissor craft, skull assessment, hot shave' },
      { name: 'Roya', role: 'Senior Stylist', experience: '20+ years', specialty: 'Dimensional color, balayage, bouncy blowouts' },
    ],
  });
});

// Fallback conversation endpoint if WebSockets are blocked by client environment
app.post('/api/gemini/converse', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const systemInstruction = `You are the virtual salon concierge and style advisor for Bayview Mall Creative Hair Dsn, located inside Bayview-Cummer Shopping Centre (3285 Bayview Ave, North York, Ontario M2K 0E6, Floor 1).
You speak in a warm, welcoming, polite, and knowledgeable voice.
Salon facts:
- Master Barber Joe: 35+ years authentic Italian barber craft, classic scissor cuts, cranial contour & skull assessment, hot lather shaves, taper fades, beard grooming.
- Senior Stylist Roya: 20+ years in women's hair design, dimensional balayage, bouncy blowouts, restorative hair treatments, grey blending.
- Appointment policy: Zero-wait guaranteed on-time chairs.
- Location: Bayview-Cummer Shopping Centre (3285 Bayview Ave, North York, ON M2K 0E6), Floor 1, free plaza parking directly outside.
- Phone number: (416) 221-2321. Always give this exact phone number: (416) 221-2321.
- Operating Hours:
  * Tuesday – Friday: 9:00 AM – 6:30 PM
  * Saturday: 8:30 AM – 5:00 PM
  * Sunday: CLOSED (The salon is completely CLOSED on Sundays)
  * Monday: CLOSED (The salon is completely CLOSED on Mondays)
- CRITICAL on Sunday & Monday: Never say the salon is open on Sunday or Monday. If asked about weekend appointments, inform them the salon is open on Saturday from 8:30 AM to 5:00 PM, and is CLOSED on Sunday.
Guidelines:
- Keep responses concise (1 to 3 spoken sentences) so the conversation flows seamlessly.
- If asked about booking or how to call the salon, inform them that the salon's phone number is (416) 221-2321, or they can book directly through the website.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'Welcome to Bayview Mall Creative Hair. Master Barber Joe and Senior Stylist Roya are available Tuesday through Saturday.';
    res.json({ text: reply });
  } catch (err: any) {
    console.error('Error in /api/gemini/converse:', err);
    res.status(500).json({ error: err.message || 'Failed to generate response' });
  }
});

// WebSocket Server for Gemini Live API audio streaming
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  try {
    const host = request.headers.host || 'localhost:3000';
    const url = new URL(request.url || '', `http://${host}`);
    if (url.pathname === '/api/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
      return;
    }
  } catch (err) {
    console.error('WebSocket upgrade error:', err);
    socket.destroy();
  }
});

wss.on('connection', async (clientWs: WebSocket, request: http.IncomingMessage) => {
  let session: any = null;
  let isClosed = false;

  clientWs.on('close', () => {
    isClosed = true;
    if (session) {
      try {
        session.close();
      } catch (err) {
        // ignore cleanup error
      }
    }
  });

  try {
    const host = request.headers.host || 'localhost:3000';
    const url = new URL(request.url || '', `http://${host}`);
    const voiceParam = url.searchParams.get('voice') || 'Zephyr';
    const validVoices = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'];
    const voiceName = validVoices.includes(voiceParam) ? voiceParam : 'Zephyr';

    if (!process.env.GEMINI_API_KEY) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          error: 'Gemini API key is not configured on the server. Please attach GEMINI_API_KEY.',
        })
      );
      return;
    }

    const systemInstruction = `You are the virtual salon concierge and style advisor for Bayview Mall Creative Hair Dsn, located inside Bayview-Cummer Shopping Centre (3285 Bayview Ave, North York, Ontario M2K 0E6, Floor 1).
You speak in a warm, welcoming, polite, and knowledgeable voice.
Salon facts:
- Master Barber Joe: 35+ years authentic Italian barber craft, classic scissor cuts, cranial contour & skull assessment, hot lather shaves, taper fades, beard grooming.
- Senior Stylist Roya: 20+ years in women's hair design, dimensional balayage, bouncy blowouts, restorative hair treatments, grey blending.
- Appointment policy: Zero-wait guaranteed on-time chairs.
- Location: Bayview-Cummer Shopping Centre (3285 Bayview Ave, North York, ON M2K 0E6), Floor 1, free plaza parking directly outside.
- Phone number: (416) 221-2321. Always give this exact phone number: (416) 221-2321.
- Operating Hours:
  * Tuesday – Friday: 9:00 AM – 6:30 PM
  * Saturday: 8:30 AM – 5:00 PM
  * Sunday: CLOSED (The salon is completely CLOSED on Sundays)
  * Monday: CLOSED (The salon is completely CLOSED on Mondays)
- CRITICAL on Sunday & Monday: Never say the salon is open on Sunday or Monday. If asked about weekend appointments, inform them the salon is open on Saturday from 8:30 AM to 5:00 PM, and is CLOSED on Sunday.
Guidelines for voice conversation:
- Speak naturally and conversationally.
- Keep responses concise (1 to 3 spoken sentences) so the conversation flows seamlessly without long monologues, unless the user asks for a detailed breakdown.
- If asked about booking or how to call the salon, inform them that the salon's phone number is (416) 221-2321, or they can book directly through the website.`;

    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
        systemInstruction,
        outputAudioTranscription: {},
        inputAudioTranscription: {},
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          if (clientWs.readyState !== WebSocket.OPEN) return;

          // Model audio chunk
          const parts = message.serverContent?.modelTurn?.parts;
          if (parts && parts.length > 0) {
            for (const part of parts) {
              if (part.inlineData?.data) {
                clientWs.send(
                  JSON.stringify({
                    type: 'audio',
                    audio: part.inlineData.data,
                  })
                );
              }
              if (part.text) {
                clientWs.send(
                  JSON.stringify({
                    type: 'text',
                    text: part.text,
                  })
                );
              }
            }
          }

          // User speech transcription
          const inputTx = (message.serverContent as any)?.inputAudioTranscription?.text;
          if (inputTx) {
            clientWs.send(
              JSON.stringify({
                type: 'transcript',
                role: 'user',
                text: inputTx,
              })
            );
          }

          // Model speech transcription
          const outputTx = (message.serverContent as any)?.outputAudioTranscription?.text;
          if (outputTx) {
            clientWs.send(
              JSON.stringify({
                type: 'transcript',
                role: 'assistant',
                text: outputTx,
              })
            );
          }

          // User interruption (user began speaking while model was outputting)
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: 'interrupted' }));
          }

          // Turn complete
          if (message.serverContent?.turnComplete) {
            clientWs.send(JSON.stringify({ type: 'turnComplete' }));
          }
        },
        onerror: (err: any) => {
          console.error('Live session error:', err);
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(
              JSON.stringify({
                type: 'error',
                error: err?.message || 'Live session error occurred',
              })
            );
          }
        },
        onclose: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'closed' }));
          }
        },
      },
    });

    if (isClosed) {
      session.close();
      return;
    }

    clientWs.send(JSON.stringify({ type: 'connected', voice: voiceName }));

    clientWs.on('message', async (data: any) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'ping') {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'pong' }));
          }
          return;
        }

        if (msg.type === 'audio' && msg.audio && session) {
          session.sendRealtimeInput({
            audio: { data: msg.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (msg.type === 'text' && msg.text && session) {
          try {
            await session.sendClientContent({
              turns: [
                {
                  role: 'user',
                  parts: [{ text: msg.text }],
                },
              ],
              turnComplete: true,
            });
          } catch (textErr) {
            console.error('Error sending client content to Live session:', textErr);
          }
        }
      } catch (err) {
        console.error('Error handling message from client:', err);
      }
    });
  } catch (err: any) {
    console.error('Failed to initialize Gemini Live session:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          error: err?.message || 'Failed to start Live voice session',
        })
      );
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
