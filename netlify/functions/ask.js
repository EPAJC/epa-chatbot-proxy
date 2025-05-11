// netlify/functions/ask.js

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,            // ➊
});

exports.handler = async function (event, context) {
  // only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const userMessage = payload.message?.trim();
  if (!userMessage) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No message provided" }),
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",    // ➋
      messages: [
        {
          role: "system",
          content:
            process.env.OPENAI_SYSTEM ||
            "You are an AS/NZS 3000 expert.",
        },                                                  // ➌
        { role: "user", content: userMessage },
      ],
    });

    const answer = response.choices?.[0]?.message?.content || "";
    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
