import { REST, Routes } from "discord.js";
import { DiscordInfo } from "./config.js";

// export const commandContent = ["/collect"];
const commands = [
  {
    name: "collect",
    description: "Collect your pictures for your fabrie!",
  },
  {
    name: "bind",
    description: "bind your fabrie account",
  },
  {
    name: "unbind",
    description: "unbind your fabrie account",
  },
  {
    name: "ping",
    description: "ping ping ping",
  },
];

const rest = new REST({ version: "10" }).setToken(DiscordInfo.TOKEN);

export async function setCommands() {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(DiscordInfo.APPID), {
      body: commands,
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
