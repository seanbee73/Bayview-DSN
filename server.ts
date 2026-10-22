import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { getSalonKnowledgePrompt, SALON_INFO, SALON_FAQ_ITEMS } from './src/data/salonFaq';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Initialize Google GenAI client with required aistudio-build telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

// System Instructions tailored from src/data/salonFaq.ts (Single Source of Truth)
const BASE_SALON_KNOWLEDGE = `
You are the official AI Style Consultant & Salon Concierge for "${SALON_INFO.name}", North York's premier Italian barber and creative hair studio.

${getSalonKnowledgePrompt()}

Additional Behavioral Guidelines:
- Adhere strictly to the facts, policies, and prices provided in the verified knowledge base above.
- Never state that the shop is open on Sunday or Monday.
- Give constructive, personalized advice on face shapes (oval, square, round, oblong, heart), crown cowlicks, and head contour assessment.
- Encourage users to book an on-time chair with Joe or Roya, or call ${SALON_INFO.contact.phone}.
- Format responses cleanly with brief paragraphs, bullet points when listing steps, and helpful recommendations.
`;

const PERSONA_PROMPTS: Record<string, string> = {
  concierge: `
${BASE_SALON_KNOWLEDGE}
Active Persona: Salon Concierge & Guest Hostess.
Your focus: Provide welcoming guidance on salon appointments, services, pricing, parking, timing, and matching guests with either Joe or Roya. Be elegant, efficient, and inviting.
`,
  barber: `
${BASE_SALON_KNOWLEDGE}
Active Persona: Master Barber Joe (40+ Years Italian Barber Craft).
Your focus: Speak with the voice and wisdom of Joe. Warm, humble, deeply experienced, passionate about traditional Italian shear-over-comb technique, head contour assessment, cowlick management, and razor-sharp neck finishes. Provide expert advice on men's hair, head shapes, fade graduations, and beard grooming.
`,
  stylist: `
${BASE_SALON_KNOWLEDGE}
Active Persona: Senior Creative Stylist Roya (Color & Texture Specialist).
Your focus: Speak with the voice and artistry of Roya. Creative, attentive, inspiring, and encouraging. Focus on hair dimension, face-framing layers, healthy blowouts, dimensional color/highlights, and daily maintenance routines for effortless elegance.
`,
};

// Multi-turn Gemini Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const {
      message,
      history = [],
      persona = 'concierge',
      model = 'gemini-3.8-flash',
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string.' });
    }

    // Determine model according to task guidance:
    // gemini-3.8-flash for general tasks (default)
    // gemini-3.1-flash-lite for fast tasks
    // gemini-4-argon for complex tasks
    const validModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-4-argon'];
    const chosenModel = validModels.includes(model) ? model : 'gemini-3.8-flash';

    const systemInstruction = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.concierge;

    // Convert client history to @google/genai Content format
    const formattedHistory = Array.isArray(history)
      ? history
          .filter((item: ChatHistoryItem) => item && item.text && (item.role === 'user' || item.role === 'model'))
          .map((item: ChatHistoryItem) => ({
            role: item.role,
            parts: [{ text: item.text }],
          }))
      : [];

    const candidateModels = [
      chosenModel,
      chosenModel === 'gemini-3.1-flash-lite' ? 'gemini-3.8-flash' : 'gemini-3.1-flash-lite',
    ];

    let replyText = '';
    let successfullyUsedModel = chosenModel;
    let lastError: any = null;

    for (const currentModel of candidateModels) {
      try {
        const chat = ai.chats.create({
          model: currentModel,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
          history: formattedHistory,
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Model timeout after 12000ms')), 12000)
        );

        const response: any = await Promise.race([
          chat.sendMessage({ message }),
          timeoutPromise,
        ]);

        replyText = response.text || '';
        successfullyUsedModel = currentModel;
        lastError = null;
        break; // Successfully got response
      } catch (modelError: any) {
        lastError = modelError;
        // Gracefully attempt next candidate model or fallback
      }
    }

    if (!replyText) {
      // If upstream model API encounters a temporary 503/429 demand spike or connectivity issue,
      // return a graceful salon consultation response so user experience is never blocked.
      console.info('Upstream Gemini API currently busy; serving resilient salon consultation response.');
      replyText = generateIntelligentSalonFallback(message, persona);
      successfullyUsedModel = `${chosenModel} (Craftsman Cache)`;
    }

    return res.json({
      text: replyText,
      modelUsed: successfullyUsedModel,
    });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    // Even in catch, return an articulate salon response
    const fallbackText = generateIntelligentSalonFallback(req.body?.message || '', req.body?.persona || 'concierge');
    return res.json({
      text: fallbackText,
      modelUsed: 'Bayview Stylist Concierge',
    });
  }
});

function generateIntelligentSalonFallback(message: string, persona: string): string {
  const lower = message.toLowerCase();

  const isHoursQuery =
    lower.includes('hour') ||
    lower.includes('time') ||
    lower.includes('open') ||
    lower.includes('sunday') ||
    lower.includes('monday') ||
    lower.includes('schedule') ||
    lower.includes('days');

  if (isHoursQuery) {
    if (persona === 'barber') {
      return "I'm behind the chair Tuesday through Friday from 9:00 AM to 6:30 PM, and Saturday from 8:30 AM to 5:00 PM. Please keep in mind that the shop is strictly CLOSED on Sundays and Mondays. Book an on-time chair with me Tuesday through Saturday at Bayview-Cummer Shopping Centre, or call (416) 221-2321!";
    }
    if (persona === 'stylist') {
      return "Our salon is open Tuesday through Friday from 9:00 AM to 6:30 PM, and Saturday from 8:30 AM to 5:00 PM. Please note that we are CLOSED on Sundays and Mondays. I would love to see you Tuesday through Saturday for your styling or color consultation!";
    }
    return "Bayview Mall Creative Hair Dsn is open Tuesday through Friday from 9:00 AM to 6:30 PM, and Saturday from 8:30 AM to 5:00 PM.\n\nPlease note: The shop is completely CLOSED on Sundays and Mondays.\n\nWe are located on Floor 1 of Bayview-Cummer Shopping Centre (3285 Bayview Ave) with extensive free surface and covered parking right outside!";
  }

  if (persona === 'barber') {
    if (lower.includes('contour') || lower.includes('head') || lower.includes('shape') || lower.includes('skull')) {
      return "In my 40+ years of Italian barbering, feeling the crown, occipital bone curve, and cowlick direction before cutting is everything. Most clipper shops rush in and buzz off natural weight lines. By analyzing your skull geometry and using shear-over-comb texturing, we create balance that stays sharp as your hair grows out over 4 to 6 weeks. Come sit in my chair on Floor 1, and let's assess your natural contour.";
    }
    if (lower.includes('fade') || lower.includes('scissor') || lower.includes('cut')) {
      return "Our signature Men's Scissor Cut ($30) is sculpted with shears rather than aggressive clipper guards. We feather the neckline with a traditional warm lather straight-razor finish and soothing balm, so your neck stays clean without irritation. Guaranteed on-time seating, unhurried and precise.";
    }
    if (lower.includes('beard') || lower.includes('shave')) {
      return "For beards, we offer traditional straight-razor edging and shaping ($15) using warm conditioning oils and hot towels. It sharpens your jawline and softens the facial hair without irritation.";
    }
    return "Buongiorno! Whether you're dealing with stubborn cowlicks, looking for a balanced gentlemen's cut, or wanting a clean neck taper, I'm at your service at Bayview-Cummer Shopping Centre. Feel free to book an on-time chair or call (416) 221-2321!";
  }

  if (persona === 'stylist') {
    if (lower.includes('color') || lower.includes('highlight') || lower.includes('balayage')) {
      return "For dimensional color and highlights, I begin with an in-depth consultation examining your skin undertone, natural hair texture, and maintenance goals. We do everything from soft honey-caramel balayage to grey blending and rich glosses that preserve hair health and shine.";
    }
    if (lower.includes('layer') || lower.includes('face') || lower.includes('fine') || lower.includes('volume')) {
      return "For face-framing and volume, internal point-cutting and subtle graduated layers take away bulky heaviness while giving movement and bounce when you blow-dry. A proper cut should style effortlessly at home in minutes!";
    }
    return "Hello! I would love to help you refresh your style with a tailored cut, dimensional color, or a volumizing blowout. Book a consultation or stop by our Floor 1 salon at Bayview and Cummer!";
  }
  if (lower.includes('park') || lower.includes('location') || lower.includes('address') || lower.includes('where')) {
    return `We are located inside ${SALON_INFO.address.mall} at ${SALON_INFO.address.street}, ${SALON_INFO.address.city}, ON ${SALON_INFO.address.postalCode} (${SALON_INFO.address.locationDetail}). ${SALON_INFO.parking.types} are available directly steps away from our entrance (${SALON_INFO.parking.cost})!`;
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('service') || lower.includes('how much')) {
    const servicesList = SALON_INFO.services
      .map((s) => `• ${s.name}: ${s.price}`)
      .join('\n');
    return `Our core services include:\n${servicesList}\n\nAll appointments are protected by our Guaranteed On-Time Chairs policy!`;
  }
  if (lower.includes('book') || lower.includes('appointment')) {
    return `Booking is simple! You can click 'Book Appointment' right in this consultation window to reserve an on-time chair with Joe or Roya, or call us directly at ${SALON_INFO.contact.phone}. We guarantee zero waiting time for booked guests.`;
  }

  return `Welcome to ${SALON_INFO.name}! We specialize in traditional Italian barber craftsmanship with Master Barber Joe (40+ years experience) and high-end styling with Roya. How can I assist you with appointment scheduling, haircut consultations, or store directions today?`;
}

// Full-Stack Dev / Prod mounting
async function startServer() {
  const httpServer = http.createServer(app);

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Bayview Creative Hair Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
