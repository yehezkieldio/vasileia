import type { VasileiaClientOptions } from "@/libs/extensions/client";
import { LogLevel } from "@sapphire/framework";
import { ActivityType, GatewayIntentBits } from "discord.js";

export const configuration: VasileiaClientOptions = {
    overrideApplicationCommandsRegistries: true,
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    loadMessageCommandListeners: true,
    loadSubcommandErrorListeners: true,
    loadDefaultErrorListeners: true,
    defaultPrefix: "vasi.",
    presence: {
        activities: [
            {
                type: ActivityType.Playing,
                name: "with the stars ✨",
            },
        ],
        status: "dnd",
    },
    typing: true,
    logger: {
        level: LogLevel.Debug,
    },
};
