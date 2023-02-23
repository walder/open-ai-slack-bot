class ErrorReply {
  constructor(app, message, deleteMessage) {
    this.app = app;
    this.message = message;
    this.deleteMessage = deleteMessage;
  }
  async postEmphemeralMessage() {
    let params = {
      token: process.env.SLACK_BOT_TOKEN,
      text: ":skull: Sorry, Open AI, is down :skull:",
      channel: this.message.channel,
      user: this.message.user,
    };

    if (this.message.thread_ts) {
      params.thread_ts = this.message.thread_ts;
    }
    if (this.deleteMessage) {
      const chatDelete = await this.app.client.chat.delete({
        token: process.env.SLACK_BOT_TOKEN,
        channel: this.deleteMessage.channel,
        ts: this.deleteMessage.ts,
      });
    }
    const ephemeralFailureMessage = await this.app.client.chat.postEphemeral(
      params
    );
  }
}
module.exports = ErrorReply;
