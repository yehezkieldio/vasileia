import { VasileiaCommand } from "@/libs/extensions/command";
import { isMessageInstance } from "@sapphire/discord.js-utilities";
import { RegisterBehavior } from "@sapphire/framework";
import { SlashCommandBuilder } from "discord.js";

/**
 * Perform a ping command to check the bot's latency.
 * @version 1.0.0
 */
export class PingCommand extends VasileiaCommand {
    public constructor(context: VasileiaCommand.Context, options: VasileiaCommand.Options) {
        super(context, {
            name: "ping",
            description: "Perform a ping command to check the bot's latency.",
            requiredClientPermissions: ["SendMessages"],
            preconditions: ["GuildOnly"],
            ...options,
        });
    }

    public override registerApplicationCommands(registry: VasileiaCommand.Registry) {
        const command = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        void registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: [],
            idHints: [],
        });
    }

    public async chatInputRun(interaction: VasileiaCommand.ChatInputCommandInteraction) {
        const msg = await interaction.reply({
            content: "Performing a ping request...",
            ephemeral: true,
            fetchReply: true,
        });

        if (isMessageInstance(msg)) {
            const diff = msg.createdTimestamp - interaction.createdTimestamp;
            const ping = Math.round(this.container.client.ws.ping);
            return interaction.editReply(
                `Ping request returned with these results:\nRound trip took: ${diff}ms.\nHeartbeat: ${ping}ms.`,
            );
        }

        return interaction.editReply("Failed to perform ping request.");
    }
}
