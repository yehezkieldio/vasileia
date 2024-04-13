import { db } from "@/database";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const main = async () => {
    try {
        await migrate(db, { migrationsFolder: "migrations" });
        console.log("Migrations ran successfully!");

        process.exit(0);
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error running migrations: ${err.message}`);
        }

        process.exit(1);
    }
};

void main();
