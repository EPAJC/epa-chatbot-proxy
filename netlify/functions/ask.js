const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    const resp = await openai.createChatCompletion({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are an AS/NZS 3000 expert." },
        { role: "user", content: message }
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
