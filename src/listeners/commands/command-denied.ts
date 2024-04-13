import { EmbedBuilder } from "@/libs/extensions/embed-builder";
import { VasileiaEvents } from "@/libs/typings/events";
import { VasileiaIdentifiers } from "@/libs/typings/identifier";
import { type ChatInputCommandDeniedPayload, Listener, type UserError } from "@sapphire/framework";
import type { InteractionResponse } from "discord.js";

export class ChatInputCommandDeniedListener extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            once: false,
            event: VasileiaEvents.ChatInputCommandDenied,
        });
    }

    public async run(error: UserError, data: ChatInputCommandDeniedPayload): Promise<InteractionResponse<boolean>> {
        const embed: EmbedBuilder = new EmbedBuilder().isErrorEmbed();

        switch (error.identifier) {
            // Catch for when the command is disabled
            case VasileiaIdentifiers.CommandDisabled:
                embed.setDescription("This command has been disabled.");
                return data.interaction.reply({ embeds: [embed], ephemeral: true });

            // Catch for when the user does not have the required cooldown
            case VasileiaIdentifiers.PreconditionCooldown:
                embed.setDescription("Please wait before using this command again.");
                return data.interaction.reply({ embeds: [embed], ephemeral: true });

            // Catch for when the user does not have the required permissions
            case VasileiaIdentifiers.PreconditionUserPermissions ||
                VasileiaIdentifiers.PreconditionUserPermissionsNoPermissions:
                embed.setDescription("You do not have the required permissions to use this command.");
                return data.interaction.reply({ embeds: [embed], ephemeral: true });

            // Catch for when the bot does not have the required permissions
            case VasileiaIdentifiers.PreconditionClientPermissions ||
                VasileiaIdentifiers.PreconditionClientPermissionsNoPermissions:
                embed.setDescription("I do not have the required permissions to use this command.");
                return data.interaction.reply({ embeds: [embed], ephemeral: true });

            // Catch all for any other errors
            default:
                this.container.logger.error(error);
                embed.setDescription(
                    `An error occurred while executing this command.\n${error.identifier}\n${error.message}`,
                );
                return data.interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}
