import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in lib/db.ts");
}

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

// // Make sure to install the 'postgres' package
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';

// const queryClient = postgres(process.env.DATABASE_URL);
// const db = drizzle({ client: queryClient });

// const result = await db.execute('select 1');
