import { VasileiaCommand } from "@/libs/extensions/command";
import { DEVELOPMENT_SERVERS } from "@/utils/consts";
import { RegisterBehavior } from "@sapphire/framework";
import { SlashCommandBuilder } from "discord.js";

/**
 * Globally disable a command from being used in the bot.
 * @version 1.0.0
 */
export class DisableCommandCommand extends VasileiaCommand {
    public constructor(context: VasileiaCommand.Context, options: VasileiaCommand.Options) {
        super(context, {
            name: "disable-command",
            description: "Globally disable a command from being used in the bot.",
            requiredClientPermissions: ["SendMessages"],
            preconditions: ["GuildOnly", "DeveloperOnly"],
            ...options,
        });
    }

    public override registerApplicationCommands(registry: VasileiaCommand.Registry) {
        const commands = this.container.stores.get("commands");

        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption((option) =>
                option
                    .setName("command")
                    .setDescription("The command name to disable.")
                    .setRequired(true)
                    .addChoices(
                        ...commands.map((command) => ({ name: command.name, value: `${command.name.toLowerCase()}` })),
                    ),
            );
        void registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: DEVELOPMENT_SERVERS,
            idHints: [],
        });
    }

    public async chatInputRun(interaction: VasileiaCommand.ChatInputCommandInteraction) {
        const commandName = interaction.options.getString("command");
        const command = this.container.stores.get("commands").get(commandName as string);

        if (!command) {
            return await interaction.reply({
                content: `Could not find a command with the name \`${commandName}\`.`,
            });
        }

        if (command.enabled === false) {
            return await interaction.reply({
                content: `The command \`${command.name}\` is already disabled.`,
            });
        }

        command.enabled = false;

        return await interaction.reply({
            content: `The command \`${command.name}\` has been disabled.`,
        });
    }
}
