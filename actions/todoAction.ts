"use server";
import { users } from "@/db/schema";
import { db } from "@/lib/db";

export async function createUser(name: string, email: string) {
    await db.insert(users).values({ name, email });
}

export async function getUsers() {
    return await db.select().from(users);
}