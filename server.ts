import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Fallback dynamic surveys database for offline / error resilience
const FALLBACK_TOPIC_SURVEYS: Record<string, Array<{ title: string; category: string; questions: Array<{ question: string; options: string[] }> }>> = {
  Cultura: [
    {
      title: 'Música, Tradiciones y Expresiones Culturales',
      category: 'Cultura',
      questions: [
        {
          question: '¿Cuál es el género musical más representativo del folclor caribeño en Colombia y reconocido por la UNESCO?',
          options: ['Vallenato', 'Reggaetón', 'Pasillo', 'Bambuco']
        },
        {
          question: '¿Qué autor latinoamericano fue galardonado con el Premio Nobel de Literatura por "Cien Años de Soledad"?',
          options: ['Gabriel García Márquez', 'Mario Vargas Llosa', 'Jorge Luis Borges', 'Pablo Neruda']
        },
        {
          question: '¿Con qué frecuencia asistes a eventos culturales o museos en tu ciudad?',
          options: ['Una o más veces al mes', 'Cada 3 a 6 meses', 'Una vez al año', 'Rara vez o nunca']
        }
      ]
    },
    {
      title: 'Patrimonio Arquitectónico y Fiestas Tradicionales',
      category: 'Cultura',
      questions: [
        {
          question: '¿Cuál de las siguientes festividades es una de las más grandes celebraciones del carnaval en Sudamérica?',
          options: ['Carnaval de Barranquilla', 'Fiesta de las Flores', 'Feria de Manizales', 'Festival Vallenato']
        },
        {
          question: '¿Qué tipo de arte visual despierta mayor interés en tu tiempo libre?',
          options: ['Pintura y Escultura', 'Cine y Audiovisual', 'Fotografía urbana', 'Teatro y Danza']
        }
      ]
    }
  ],
  Deporte: [
    {
      title: 'Hábitos Deportivos, Fútbol y Ciclismo 2026',
      category: 'Deporte',
      questions: [
        {
          question: '¿Qué disciplina deportiva consideras que le ha dado más títulos mundiales y glorias al país?',
          options: ['Ciclismo de ruta y pista', 'Fútbol profesional', 'Patinaje de velocidad', 'Halterofilia / Levantamiento de pesas']
        },
        {
          question: '¿Cuántos días a la semana realizas actividad física o ejercicio estructurado?',
          options: ['5 o más días', '3 a 4 días por semana', '1 a 2 días los fines de semana', 'No realizo ejercicio regular']
        },
        {
          question: '¿Cuál es tu formato preferido para seguir transmisiones deportivas en vivo?',
          options: ['Televisión por suscripción', 'Plataformas de streaming digital', 'Redes sociales y resúmenes', 'Radio deportiva']
        }
      ]
    },
    {
      title: 'Tendencias en Fitness, Running y Nutrición Deportiva',
      category: 'Deporte',
      questions: [
        {
          question: '¿Has participado o te gustaría participar en una carrera atlética 5K o 10K?',
          options: ['Ya he participado varias veces', 'Me gustaría participar este año', 'Prefiero el gimnasio o deportes colectivos', 'No me llama la atención']
        },
        {
          question: '¿Qué suplemento o complemento consumes con mayor regularidad al ejercitarte?',
          options: ['Proteína de suero / vegetal', 'Bebidas isotónicas e hidratantes', 'Creatina o pre-entreno', 'Solo agua e hidratación natural']
        }
      ]
    }
  ],
  Historia: [
    {
      title: 'Hitos Históricos, Bicentenario e Independencia',
      category: 'Historia',
      questions: [
        {
          question: '¿En qué fecha se conmemora el Grito de Independencia de Colombia?',
          options: ['20 de Julio de 1810', '7 de Agosto de 1819', '12 de Octubre de 1492', '11 de Noviembre de 1811']
        },
        {
          question: '¿Qué batalla selló de manera decisiva la gesta libertadora liderada por Simón Bolívar?',
          options: ['Batalla de Boyacá (1819)', 'Batalla de Pantano de Vargas', 'Batalla de Pichincha', 'Batalla de Carabobo']
        },
        {
          question: '¿Cuál es la civilización precolombina destacada por la extraordinaria orfebrería de la balsa muisca y la leyenda de El Dorado?',
          options: ['Muisca / Chibcha', 'Tairona', 'Quimbaya', 'Calima']
        }
      ]
    },
    {
      title: 'Historia Mundial del Siglo XX y Transformaciones Sociales',
      category: 'Historia',
      questions: [
        {
          question: '¿Qué acontecimiento en 1969 marcó un hito sin precedentes en la exploración espacial humana?',
          options: ['La llegada del Apolo 11 a la Luna', 'El lanzamiento del telescopio Hubble', 'El vuelo del Sputnik 1', 'La construcción de la Estación Espacial']
        },
        {
          question: '¿Cuál fue el invento tecnológico del siglo XX que transformó definitivamente la comunicación global?',
          options: ['La World Wide Web / Internet', 'La televisión a color', 'El transistor de radio', 'El motor de combustión']
        }
      ]
    }
  ]
};

// API: Generate AI Survey
app.post('/api/generate-survey', async (req, res) => {
  const { topic } = req.body;
  const validTopics = ['Cultura', 'Deporte', 'Historia'];
  const selectedTopic = validTopics.includes(topic)
    ? topic
    : validTopics[Math.floor(Math.random() * validTopics.length)];

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Genera una encuesta entretenida y rigurosa en español sobre el tema: "${selectedTopic}".
La encuesta debe ser de estudio de mercado o conocimiento general para la plataforma GanaPro.
Debe tener exactamente 3 preguntas con 4 opciones de respuesta cada una.
Devuelve EXCLUSIVAMENTE un JSON válido con esta estructura exacta sin formato markdown adicional:
{
  "title": "Título llamativo de la encuesta sobre ${selectedTopic}",
  "category": "${selectedTopic}",
  "duration": "3 mins",
  "questions": [
    {
      "question": "¿Pregunta 1 interesante?",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"]
    },
    {
      "question": "¿Pregunta 2 interesante?",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"]
    },
    {
      "question": "¿Pregunta 3 interesante?",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text?.trim() || '';
      const parsed = JSON.parse(text);
      if (parsed.title && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return res.json({
          success: true,
          source: 'gemini-ai',
          survey: {
            id: Date.now(),
            title: parsed.title,
            category: parsed.category || selectedTopic,
            duration: parsed.duration || '3 mins',
            isAIGenerated: true,
            questions: parsed.questions
          }
        });
      }
    } catch (err) {
      console.warn('Gemini survey generation fallback active:', err);
    }
  }

  // Fallback if AI not available or error
  const list = FALLBACK_TOPIC_SURVEYS[selectedTopic] || FALLBACK_TOPIC_SURVEYS.Cultura;
  const picked = list[Math.floor(Math.random() * list.length)];

  return res.json({
    success: true,
    source: 'smart-fallback',
    survey: {
      id: Date.now(),
      title: `${picked.title} (${selectedTopic})`,
      category: selectedTopic,
      duration: '3 mins',
      isAIGenerated: true,
      questions: picked.questions
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GanaPro Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
