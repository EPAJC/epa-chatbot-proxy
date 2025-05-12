// netlify/functions/ask.js
const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);
    const resp = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AS/NZS 3000 expert." },
        { role: "user",   content: message }
      ]
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: resp.data.choices[0].message.content
      })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
