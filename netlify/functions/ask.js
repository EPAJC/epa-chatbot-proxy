// netlify/functions/ask.js
const { OpenAI } = require("openai");

const openai = new OpenAI({
  // pull from your env var that you set in Netlify
  apiKey: process.env.OPENAI_API_KEY,
  // optionally let you override the model in Netlify UI
  // default back to gpt-3.5-turbo if you prefer lower cost
  modelName: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
});

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body || "{}");
    if (!message) {
      return { statusCode: 400, body: "No message provided" };
    }

    const resp = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            process.env.OPENAI_SYSTEM ||
            "You are an AS/NZS 3000 expert.",
        },
        { role: "user", content: message },
      ],
    });

    const answer = resp.choices?.[0]?.message?.content || "";
    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    console.error("ask.js error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(err) }),
    };
  }
};
