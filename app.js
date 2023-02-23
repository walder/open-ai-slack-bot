// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const fetch = require("node-fetch");
const { Configuration, OpenAIApi } = require("openai");
const OpenAIConversationHandler = require("./OpenAIConversationHandler");

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
    console.log(message.thread_ts);

    // console.log("user ID: "+message.user)

    var conversationHistory = [];
    var history = 30;

    //if message is in a thread
    if (message.thread_ts) {
      const result = await app.client.conversations.replies({
        token: process.env.SLACK_BOT_TOKEN,
        channel: message.channel,
        ts: message.thread_ts,
      });
      conversationHistory = result.messages.reverse();
      //if messate is new message in main chat window:
    } else {
      const result = await app.client.conversations.history({
        token: process.env.SLACK_BOT_TOKEN,
        channel: message.channel,
      });
      conversationHistory = result.messages;
      history = 1
    }

    let conversation = new OpenAIConversationHandler(conversationHistory, history);
    let openAIPrompt = conversation.getConversation();

    const outputMessage = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      text: ":hourglass_flowing_sand:",
      channel: message.channel,
      thread_ts: message.ts,
    });

    // Print results
    console.log(openAIPrompt);

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: openAIPrompt,
        max_tokens: 1000,
        temperature: 0.9,
      });
      var textResponse = response.data.choices[0].text;
      var tokens = response.data.usage.prompt_tokens;
      const updateChatWitOpenAIResult = await app.client.chat.update({
        token: process.env.SLACK_BOT_TOKEN,
        channel: message.channel,
        ts: outputMessage.ts,
        text: textResponse,
      });
    } catch (error) {
      console.error(error);
      const chatDelete = await app.client.chat.delete({
        token: process.env.SLACK_BOT_TOKEN,
        channel: message.channel,
        ts: outputMessage.ts,
      });
      const ephemeralFailureMessage = await app.client.chat.postEphemeral({
        token: process.env.SLACK_BOT_TOKEN,
        text: ":skull: Sorry, Open AI, is down :skull:",
        channel: message.channel,
        user: message.user,
      });
    }
    // await console.log("Tokens used: " + tokens);
  } catch (error) {
    console.error(error);
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
