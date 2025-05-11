// netlify/functions/ask.js

const { Configuration, OpenAIApi } = require("openai");

// pull your API key and desired model from env
const API_KEY   = process.env.OPENAI_API_KEY;
const MODEL_ID  = process.env.OPENAI_MODEL    || "gpt-3.5-turbo";
const SYSTEMMSG = process.env.OPENAI_SYSTEM   || "You are an AS/NZS 3000 expert.";

if (!API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAIApi(
  new Configuration({ apiKey: API_KEY })
);

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body || "{}");
    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ error: "No message provided" }) };
    }

    const resp = await openai.createChatCompletion({
      model: MODEL_ID,
      messages: [
        { role: "system", content: SYSTEMMSG },
        { role: "user",   content: message }
      ]
    });

    const answer = resp.data.choices?.[0]?.message?.content || "";
    return {
      statusCode: 200,
      body: JSON.stringify({ answer })
    };
  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
