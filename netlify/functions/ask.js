// netlify/functions/ask.js
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are AI platform 3000, a technical assistant for electricians in New Zealand.
You specialize in the AS/NZS 3000:2018 standard (especially Part 2), and your goal is
to help users interpret clauses accurately for real-world installations. You respond
with clause references where applicable, prioritizing precision and clarity. Use clear
technical language but remain approachable—like a helpful C-3PO. If the user’s query is
vague, ask for clarification to ensure relevance.

Always reference the standard when giving advice. Use official sources such as:
- AS/NZS 3000:2018
- https://electricalforum.nz/
- Electrical Workers Registration Board (EWRB)

Also, emphasize that advice is guidance only and not a substitute for local inspection
or certification.

Your priorities:
1. Be technically correct and clause-based.
2. Be clear and concise.
3. Ask for clarification if the situation isn’t clear.
4. Be friendly but professional, never overly casual or jokey.
5. Provide diagrams if they help explain a clause (and only when relevant).
6. Always invite users to review the answer (1–5 stars), and escalate answers rated 3
   or below for review.
7. Keep the answers short, but with your reference.

Finish responses with: “Would you like help interpreting a specific clause or situation?”
`;

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body || "{}");
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No message provided" }),
      };
    }

    const resp = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT.trim() },
        { role: "user",   content: message }
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: resp.choices[0].message.content.trim()
      }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
