import { REST, Routes } from "discord.js";
import { Discord } from "./config.js";

// export const commandContent = ["/collect"];
const commands = [
  {
    name: "collect",
    description: "Collect your pictures for your fabrie!",
  },
  {
    name: "ping",
    description: "ping ping ping",
  },
];

const rest = new REST({ version: "10" }).setToken(Discord.TOKEN);

export async function setCommands() {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(Discord.APPID), {
      body: commands,
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
