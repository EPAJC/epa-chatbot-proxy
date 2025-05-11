// netlify/functions/ask.js
const OpenAI = require("openai").default;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async (event) => {
  // handle preflight CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  try {
    const { message } = JSON.parse(event.body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AS/NZS 3000 expert." },
        { role: "user",   content: message }
      ]
    });

    const answer = completion.choices[0].message.content.trim();

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ answer })
    };

  } catch (err) {
    // log the error so you can see it in Netlify logs
    console.error("ask.js error:", err);

    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ answer: null, error: err.message })
    };
  }
};
