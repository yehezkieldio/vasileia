import { Identifiers as SapphireIdentifiers } from "@sapphire/framework";

enum Identifiers {
    RegisteredUserOnly = "RegisteredUserOnly",
    DeveloperOnly = "DeveloperOnly",
}

export const VasileiaIdentifiers = {
    ...SapphireIdentifiers,
    ...Identifiers,
} as const;
