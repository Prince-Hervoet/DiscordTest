import { Client, GatewayIntentBits } from "discord.js";
import { DiscordInfo, FabrieUrls } from "./config.js";
import { setCommands } from "./command.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import fetch from "node-fetch";
import fs from "fs";
import { nanoid } from "nanoid";

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  let userInfo;
  switch (interaction.commandName) {
    case "ping":
      interaction.reply("Hello!");
      break;
    case "collect":
      userInfo = isPeopleSend(interaction);
      if (!userInfo.username) {
        interaction.reply({
          content: "Please send message in yourself",
          ephemeral: true,
        });
        return;
      }
      // if (!(await isBindFabrieId(userInfo.id))) {
      //   const [url1, url2] = authorized(userInfo.username);
      //   message.reply({
      //     content:
      //       "Please bind your fabrie account.\n" +
      //       "cn url: " +
      //       url1 +
      //       "\n" +
      //       "com url: " +
      //       url2,
      //     ephemeral: true,
      //   });
      //   return;
      // }
      // 认证
      interaction.reply({
        content: "Start collect your messages!",
        ephemeral: true,
      });
      const channel = client.channels.cache.get(interaction.channelId);
      let first = await channel.messages.fetch({
        limit: 1,
      });
      console.log(first instanceof Map);
      let pointerId;
      for (const f of first) {
        pointerId = f[0];
        const attachments = f[1].attachments;
        for (const att of attachments) {
          const url = att[1]?.url;
          await solvePic(url);
        }
      }
      let messages;
      do {
        messages = await channel.messages.fetch({
          limit: 10,
          before: pointerId,
        });
        for (const message of messages) {
          pointerId = message[0];
          if (Array.isArray(message) && message[1]?.attachments) {
            const attachments = message[1].attachments;
            for (const att of attachments) {
              const url = att[1].url;
              console.log(url);
              await solvePic(url);
            }
          }
        }
      } while (messages && messages.size > 0);
      console.log("asdfasdfasdf");
      break;
    case "bind":
      userInfo = isPeopleSend(interaction);
      if (!userInfo.username) {
        interaction.reply({
          content: "Please send message in yourself",
          ephemeral: true,
        });
        return;
      }
      if (!(await isBindFabrieId(userInfo.id))) {
        const [url1, url2] = authorized(userInfo.username);
        interaction.reply({
          content:
            "Welcome to bind your fabrie account.\n" +
            "cn url: " +
            url1 +
            "\n" +
            "com url: " +
            url2,
          ephemeral: true,
        });
        return;
      } else {
        interaction.reply({
          content: "You had bind your fabrie.",
          ephemeral: true,
        });
      }
      break;
    case "unbind":
      break;
  }
});

function isPeopleSend(message) {
  if (!message || !message.user) {
    return {};
  }
  const { bot, system, username, id } = message.user;
  if (bot === false && system === false) {
    return { username, id };
  }
  return {};
}

async function isBindFabrieId(discordId) {
  const res = await axios();
  if (res.data.code === 4000) {
    return true;
  }
  return false;
}

function authorized(discordId) {
  const randomNum1 = Math.random();
  const randomNum2 = Math.random();
  const token1 = jwt.sign(
    { discordId, randomNum1, exp: Math.floor(Date.now() / 1000) * 5 * 60 },
    DiscordInfo.SECRET + discordId,
    { issuer: "fabrie" }
  );

  const token2 = jwt.sign(
    { discordId, randomNum2, exp: Math.floor(Date.now() / 1000) * 5 * 60 },
    DiscordInfo.SECRET + discordId,
    { issuer: "fabrie" }
  );
  const url1 = FabrieUrls.CN + "?user=" + token1;
  const url2 = FabrieUrls.COM + "?user=" + token2;
  return [url1, url2];
}

async function solvePic(url) {
  try {
    const id = nanoid();
    const res = await fetch(url);
    const tar = fs.createWriteStream(`./imgs/${id}.png`);
    res.body.pipe(tar);
  } catch (e) {
    console.log(e);
  }
}

setCommands();
client.login(DiscordInfo.TOKEN).then((res) => console.log(res));
