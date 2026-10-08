const axios = require('axios');

const SYSTEM_PROMPT =
  'You are the Kozimov AI Mentor, an expert educational guide for students. ' +
  'Be encouraging, precise, and focused on learning. Keep responses concise and actionable. ' +
  'Reply in the same language the student writes in.';

const GEMINI_HOST = 'generativelanguage.googleapis.com';
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
const RETRYABLE = [429, 500, 502, 503, 504];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// .env dagi endpoint'dan model nomini ajratib olamiz
function geminiUrls(endpoint) {
  const m = endpoint.match(/^(.*\/models\/)([^/:]+)(:generateContent)$/);
  if (!m) return [endpoint];
  const [, base, model, action] = m;
  const models = [model, ...FALLBACK_MODELS.filter(x => x !== model)];
  return models.map(x => `${base}${x}${action}`);
}

async function askGemini(endpoint, apiKey, prompt) {
  let lastErr;
  for (const url of geminiUrls(endpoint)) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await axios.post(
          url,
          {
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
          },
          { headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' }, timeout: 25000 }
        );
        const text = response.data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
        if (text) return text;
        lastErr = new Error('Empty response');
        break; // keyingi modelga o'tamiz
      } catch (err) {
        lastErr = err;
        const status = err.response?.status;
        console.error(`AI API Error [${url.split('/models/')[1]}]:`, status, JSON.stringify(err.response?.data) || err.message);
        if (RETRYABLE.includes(status) && attempt === 0) { await sleep(1200); continue; } // 1 marta qayta urinish
        break; // boshqa xato yoki qayta urinish ham o'xshamadi -> keyingi model
      }
    }
  }
  throw lastErr;
}

exports.askMentor = async (req, res) => {
  const fail = (code, msg) => res.status(code).json({ message: msg, response: msg });
  try {
    const prompt = (req.body.prompt || '').toString().trim();
    if (!prompt) return fail(400, 'Savol bo\'sh bo\'lmasligi kerak.');

    const endpoint = process.env.AI_MENTOR_ENDPOINT;
    const apiKey = process.env.AI_MENTOR_API_KEY;
    if (!apiKey || !endpoint) return fail(500, 'AI Mentor hali sozlanmagan.');

    let aiText;
    if (endpoint.includes(GEMINI_HOST)) {
      aiText = await askGemini(endpoint, apiKey, prompt);
    } else {
      const response = await axios.post(
        endpoint,
        {
          model: process.env.AI_MENTOR_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        },
        { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, timeout: 25000 }
      );
      aiText = response.data?.choices?.[0]?.message?.content || '';
    }

    if (!aiText) throw new Error('AI returned an empty response');
    res.json({ response: aiText });
  } catch (err) {
    console.error('AI final error:', err.response?.status, err.message);
    const busy = RETRYABLE.includes(err.response?.status);
    fail(busy ? 503 : 500, busy
      ? 'AI Mentor hozir band (yuklama yuqori). Bir necha soniyadan keyin qayta urinib ko\'ring.'
      : 'AI Mentor hozir javob bera olmayapti. Birozdan keyin urinib ko\'ring.');
  }
};