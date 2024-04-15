import { RegisterBehavior } from "@sapphire/framework";
import { type Guild, SlashCommandBuilder } from "discord.js";

import type { APIEmbedField } from "discord.js";
import { codeBlock } from "discord.js";

import { VasileiaCommand } from "@/libs/extensions/command";
import { EmbedBuilder } from "@/libs/extensions/embed-builder";
import dayjs from "dayjs";

/**
 * View information about the server where this command is executed.
 * @version 1.0.0
 */
export class ServerInformationCommand extends VasileiaCommand {
    public constructor(context: VasileiaCommand.Context, options: VasileiaCommand.Options) {
        super(context, {
            name: "serverinfo",
            description: "View information of the server where this command is executed.",
            requiredClientPermissions: ["SendMessages"],
            preconditions: ["GuildOnly"],
            ...options,
        });
    }

    public override registerApplicationCommands(registry: VasileiaCommand.Registry): void {
        const command = new SlashCommandBuilder().setName(this.name).setDescription(this.description);

        void registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: [],
            idHints: [],
        });
    }

    public async chatInputRun(interaction: VasileiaCommand.ChatInputCommandInteraction) {
        const fieldResponses: APIEmbedField[] = await this.getFieldResponses(interaction);
        const guild: Guild = interaction.guild as Guild;

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: guild.name, iconURL: guild.iconURL({ size: 4096 }) as string })
                    .setFields([...fieldResponses]),
            ],
        });
    }

    private async getServerInformation(ctx: VasileiaCommand.ChatInputCommandInteraction) {
        const premiumTier: string[] = ["None", "Tier 1", "Tier 2", "Tier 3"];
        const guild: Guild = ctx.guild as Guild;

        return {
            bio: {
                createdAt: dayjs(guild.createdAt),
                description: guild.description === null ? "No Description" : guild.description,
                id: guild.id,
                name: guild.name,
                ownership: (await guild.fetchOwner()).user,
            },
            statistic: {
                serverRoles: guild.roles.cache.size,
                emojis: guild.emojis.cache.size,
                members: guild.memberCount,
                channels: guild.channels.cache.size,
                stickers: guild.stickers.cache.size,
            },
            features: {
                boostLevel: premiumTier[guild.premiumTier],
                boostCount: guild.premiumSubscriptionCount,
                verifiedStatus: guild.verified ? "Verified" : "Not Verified",
                partneredStatus: guild.partnered ? "Partnered" : "Not Partnered",
                vanityURL: guild.vanityURLCode == null ? "-" : `https://discord.gg/${guild.vanityURLCode}`,
            },
        };
    }

    private async getFieldResponses(ctx: VasileiaCommand.ChatInputCommandInteraction) {
        const { bio, statistic, features } = await this.getServerInformation(ctx);

        const info: string[] = [
            `Name            :  ${bio.name}`,
            `Server Id       :  ${bio.id}`,
            `Time Created    :  ${bio.createdAt.format("MMM, DD YYYY")}`,
            `Ownership       :  ${bio.ownership.username}`,
        ];

        const stats: string[] = [
            `Roles           :  ${statistic.serverRoles}`,
            `Emojis          :  ${statistic.emojis}`,
            `Members         :  ${statistic.members}`,
            `Channels        :  ${statistic.channels}`,
            `Stickers        :  ${statistic.stickers}`,
        ];

        const feats: string[] = [
            `Boost Level     :  ${features.boostLevel}`,
            `Boost Count     :  ${features.boostCount}`,
            `Verified        :  ${features.verifiedStatus}`,
            `Partnered       :  ${features.partneredStatus}`,
            `Vanity URL      :  ${features.vanityURL}`,
        ];

        return [
            { name: "Information", value: codeBlock(info.join("\n")) },
            { name: "Description", value: codeBlock(bio.description) },
            { name: "Statistics", value: codeBlock(stats.join("\n")) },
            { name: "Features", value: codeBlock(feats.join("\n")) },
        ] as APIEmbedField[];
    }
}
