// netlify/functions/ask.js
const { OpenAIApi, Configuration } = require("openai");

// initialize OpenAI client from env
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })
);

exports.handler = async (event) => {
  // 1) only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  // 2) parse JSON
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" })
    };
  }

  const { message } = body;
  if (!message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "`message` is required" })
    };
  }

  // 3) call OpenAI
  try {
    const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
    const system = process.env.OPENAI_SYSTEM || "You are an AS/NZS 3000 expert.";

    const resp = await openai.createChatCompletion({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user",   content: message }
      ]
    });

    const answer = resp.data.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ answer })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
