import { env } from "@/environment";
import type { Config } from "drizzle-kit";

export default {
    schema: "./src/database/schema/index.ts",
    out: "migrations",
    driver: "pg",
    dbCredentials: {
        connectionString: env.DATABASE_URL,
    },
} satisfies Config;
