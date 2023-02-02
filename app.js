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

var conversation = [];

app.message("", async ({ message, say }) => {
  try {
    conversation[message.user] += "\n" + message.text;
    console.log(message.user);
    //  await ack();
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: conversation[message.user],
      max_tokens: 1000,
      temperature: 0.9,
    });
    const textResponse = response.data.choices[0].text;
    await say(textResponse);
    conversation[message.user] += "\n" + textResponse;
    console.log(conversation[message.user]);
  } catch (error) {
    console.error(error);
    await say("System is currently down");
  }
});

app.command("/chat_gpt_ask", async ({ command, ack, respond }) => {
  await ack();
  await respond("currently not working");
});

app.command("/chat_gpt_reset_context", async ({ command, ack, respond }) => {  
  //console.log(command.user_id)
  conversation[command.user_id] = null;
  await ack()
  await respond("----History Purged----")
});
