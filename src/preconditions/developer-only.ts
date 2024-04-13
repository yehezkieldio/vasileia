import { VasileiaIdentifiers } from "@/libs/typings/identifier";
import { DEVELOPERS } from "@/utils/consts";
import { Precondition } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";

export class DeveloperOnlyPrecondition extends Precondition {
    public constructor(context: Precondition.LoaderContext, options: Precondition.Options) {
        super(context, {
            ...options,
            name: VasileiaIdentifiers.DeveloperOnly,
        });
    }

    public async chatInputRun(interaction: CommandInteraction) {
        if (DEVELOPERS.includes(interaction.user.id)) {
            return this.ok();
        }

        return this.error({
            message: "This command is only available to developers.",
            identifier: VasileiaIdentifiers.DeveloperOnly,
        });
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        DeveloperOnly: never;
    }
}
