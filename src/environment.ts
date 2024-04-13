import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        DISCORD_URL: z.string().min(1),
        DATABASE_URL: z.string().min(1),
    },
    runtimeEnv: process.env,
});
