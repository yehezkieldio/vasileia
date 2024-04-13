import {
    ApplicationCommandRegistries,
    RegisterBehavior,
    SapphireClient,
    type SapphireClientOptions,
    container,
} from "@sapphire/framework";
import type { ClientOptions } from "discord.js";

export interface VasileiaClientOptions extends SapphireClientOptions, ClientOptions {
    overrideApplicationCommandsRegistries?: boolean;
}

export class VasileiaClient extends SapphireClient {
    public constructor(options: VasileiaClientOptions) {
        super(options);

        if (options.overrideApplicationCommandsRegistries) {
            container.logger.info(
                "VasileiaClient: Default behavior for application commands registries are set to BulkOverwrite.",
            );
            ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
        }
    }
}
