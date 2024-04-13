import { env } from "@/environment";
import { VasileiaClient } from "@/libs/extensions/client";
import "@sapphire/plugin-logger/register";
import { configuration } from "./configuration";

/**
 * The main entrypoint for the bot.
 * @see VasileiaClient
 */
const main = async (): Promise<void> => {
    void new VasileiaClient(configuration).login(env.DISCORD_TOKEN);
};

void main();
