import { Client, GatewayIntentBits } from "discord.js";
import { Discord } from "./config.js";
import { setCommands } from "./command.js";
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const template = "/";
client.on("messageCreate", async (message) => {
  console.log(message);
  if (message.content.startsWith(template)) {
    const channel = client.channels.cache.get(message.channelId);
    const messages = await channel.messages.fetch({ limit: 10 });
    messages.forEach((ele) => {
      if (ele.attachments) {
        console.log(ele.attachments);
      }
    });
  }
});

client.on("interactionCreate", async (message) => {
  if (!message.isChatInputCommand()) return;
  switch (message.commandName) {
    case "ping":
      break;
    case "collect":
      // 认证
      message.reply("Start collect your messages!");
      const channel = client.channels.cache.get(message.channelId);
      const messages = await channel.messages.fetch({ limit: 10 });
      messages.forEach((ele) => {
        if (ele.attachments) {
          if (Object.keys(ele.attachments).length > 0) {
            console.log(ele.attachments);
          }
        }
      });
      break;
  }
});

function isBindFabrieId(discordId) {}

function authorized(discordId) {}

setCommands();
client.login(Discord.TOKEN);
