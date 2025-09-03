import { defineConfig } from "drizzle-kit";
import "dotenv/config";

// if (!process.env.DATABASE_URL) {
//     throw new Error("DATABASE_URL is not defined");
// }

export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schema.ts",
    out: "./db/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL || "postgresql://postgres:mysecretpassword@localhost:5432/postgres",
        ssl: true
    }
});