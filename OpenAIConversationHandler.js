class OpenAIConversationHandler {
  constructor(conversation, history) {
    this.conversation = conversation;
    this.history = history;
    return this;
  }
  getConversation() {
    let conversation = "";
    let history = 30;
    //if conversation history is relatively short we just take what has been written so far
    if (this.conversation.lenght < 30) history = this.conversation.lenght;

    for (let i = history; i >= 0; i--) {
      conversation += "\n" + this.conversation[i].text;
    }
    return conversation;
  }
}
module.exports = OpenAIConversationHandler;
