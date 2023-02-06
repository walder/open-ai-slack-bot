# A Slack bot that sends chat messages to Open AI

Users in a Slack workspace can chat directly to the bot by sending him a private message. The the chat bot will take in to account the last 20 messages in a conversation when giving an answer.
 
You will need an API key from Open AI:  
https://openai.com/api/

Then set up an app in your slack Workspace:  
https://api.slack.com/apps  

Set the following ENV variables:  

```
SLACK_BOT_TOKEN = <<TOKEN_FROM_SLACK>>
SLACK_SIGNING_SECRET =   <<SIGNING_SECRET_FROM_SLACK>>  
OPENAI_API_KEY = <<API_KEY_FROM_OPEN_API>>  
```

For testing purposes you can run the Slack app for free on:  
https://glitch.com
