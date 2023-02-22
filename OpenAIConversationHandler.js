class OpenAIConversationHandler {
  constructor(conversation, history) {
    this.conversation = conversation;
    this.history = history;
    return this;
  }
  getConversation() {
    let conversation = "";
    let history = this.history;
    //if conversation history is relatively short we just take what has been written so far
    if (this.conversation.length < history) history = this.conversation.length;
    //console.log("length: "+ this.conversation.length)
    for (let i = (history - 1); i >= 0; i--) {
      conversation += "\n" + this.conversation[i].text;
    }
    return conversation;
  }
}
module.exports = OpenAIConversationHandler;
