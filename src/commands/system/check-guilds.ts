import { db } from "@/database";
import { serversTable } from "@/database/schema";
import { VasileiaCommand } from "@/libs/extensions/command";
import { DEVELOPMENT_SERVERS } from "@/utils/consts";
import { RegisterBehavior } from "@sapphire/framework";
import { SlashCommandBuilder } from "discord.js";
import { eq } from "drizzle-orm";

/**
 * Perform a manual integrity check for all connected guilds the bot is in.
 * @version 1.0.0
 */
export class CheckGuildIntegritiesCommand extends VasileiaCommand {
    public constructor(context: VasileiaCommand.Context, options: VasileiaCommand.Options) {
        super(context, {
            name: "check-guilds",
            description: "Perform a manual integrity check for all connected guilds the bot is in.",
            requiredClientPermissions: ["SendMessages"],
            preconditions: ["DeveloperOnly"],
            ...options,
        });
    }

    public override registerApplicationCommands(registry: VasileiaCommand.Registry) {
        const command = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        void registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: DEVELOPMENT_SERVERS,
            idHints: [],
        });
    }

    public async chatInputRun(interaction: VasileiaCommand.ChatInputCommandInteraction) {
        const guilds = this.container.client.guilds.cache.map((guild) => guild.id);

        const processes: string[] = [
            `Discovered ${guilds.length} guilds. Performing an integrity check for each guild, this may take a while, please wait...`,
            "Could not find a guild settings for this server. Creating a new one...",
            "Successfully created a new guild settings for the server.",
            "Guild settings are verified and synced for the server",
        ];

        await interaction.reply({
            content: processes[0],
        });
        for (const guild of guilds) {
            const guildQuery = await db.select().from(serversTable).where(eq(serversTable.discordId, guild));
            if (guildQuery.length === 0) {
                await interaction.editReply(`${processes[0]}\n${processes[1]}`);
                await db.insert(serversTable).values({
                    discordId: guild,
                });
                await interaction.editReply(`${processes[0]}\n${processes[1]}\n${processes[2]}`);
            }
        }
        await interaction.editReply(`${processes[0]}\n${processes[3]}`);
    }
}
