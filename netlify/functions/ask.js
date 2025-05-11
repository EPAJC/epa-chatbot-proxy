const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.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 })
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
      body: JSON.stringify({ answer: resp.data.choices[0].message.content })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
