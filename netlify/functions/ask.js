// netlify/functions/ask.js
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    // use ENV overrides if you set them (step 4 in Netlify UI)
    const systemPrompt = process.env.OPENAI_SYSTEM || "You are an AS/NZS 3000 expert.";
    const model        = process.env.OPENAI_MODEL  || "gpt-3.5-turbo";

    const resp = await openai.createChatCompletion({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: message }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: resp.data.choices[0].message.content.trim()
      })
    };
  } catch (err) {
    console.error("❌ ask.js error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
