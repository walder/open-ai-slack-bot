// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const fetch = require("node-fetch");
const { Configuration, OpenAIApi } = require("openai");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// All the room in the world for your code

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();

app.message("", async ({ message, say }) => {
  try {
    var conversationHistory = [];
    var chatHistory = ""
    // Call the conversations.history method using WebClient
    const result = await app.client.conversations.history({
      token: process.env.SLACK_BOT_TOKEN,
      channel: message.channel,
    });

    conversationHistory = result.messages;
    for (let i = 30 - 1; i >= 0; i--) {
      chatHistory += "\n"+conversationHistory[i].text;
    }

    // Print results
     console.log(chatHistory);

    var configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: chatHistory,
      max_tokens: 1000,
      temperature: 0.9,
    });
    var textResponse = response.data.choices[0].text;
    var tokens = response.data.usage.prompt_tokens;
    await console.log("Tokens used: "+tokens)
    await say(textResponse);
  } catch (error) {
    console.error(error);
    await say("System is currently down");
  }
});
/*
app.command("/chat_gpt_ask", async ({ command, ack, respond }) => {
  await ack();
  await respond("currently not working");
});

app.command("/chat_gpt_reset_context", async ({ command, ack, respond }) => {
  //console.log(command.user_id)
  await ack();
  await respond("----History Purged----");
});
*/
