// app/api/admin/queries/route.ts
import { db } from "@/lib/db";
import { contactQueries, user } from "@/db/schema";
import { eq, like, and, desc, asc, sql } from "drizzle-orm";
import { getCurrentUser } from "@/actions/syncUser";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        // Auth check
        const clerkUser = await currentUser();
        if (!clerkUser?.id) {
            return NextResponse.json({ error: "Unauthorized, please log in." }, { status: 401 });
        }

        const existingUser = await getCurrentUser();
        if (!existingUser || existingUser.siteRole !== "admin") {
            return NextResponse.json({ error: "Access Denied. Admins only." }, { status: 403 });
        }

        // Extract query params
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const status = searchParams.get("status"); // filter
        const search = searchParams.get("search"); // keyword
        const sort = searchParams.get("sort") || "desc"; // desc | asc

        const offset = (page - 1) * limit;

        // Build filters dynamically
        let conditions = [];
        const contactStatus = ["new", "in_progress", "resolved"] as const;
        type ContactStatus = typeof contactStatus[number];
        if (status && contactStatus.includes(status as ContactStatus)) {
            conditions.push(eq(contactQueries.status, status as ContactStatus));
        }

        if (search) {
            conditions.push(
                sql`${contactQueries.name} ILIKE ${"%" + search + "%"} OR 
             ${contactQueries.email} ILIKE ${"%" + search + "%"} OR
             ${contactQueries.subject} ILIKE ${"%" + search + "%"} OR
             ${contactQueries.message} ILIKE ${"%" + search + "%"}`
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Fetch total count for pagination
        const total = await db
            .select({ count: sql<number>`count(*)` })
            .from(contactQueries)
            .where(whereClause);

        // Fetch data with pagination
        const data = await db
            .select({
                query: contactQueries,
                admin: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profileImage: user.avatarUrl,
                    siteRole: user.siteRole,
                },
            })
            .from(contactQueries)
            .leftJoin(user, eq(contactQueries.repliedBy, user.id))
            .where(whereClause)
            .orderBy(sort === "asc" ? asc(contactQueries.createdAt) : desc(contactQueries.createdAt))
            .limit(limit)
            .offset(offset);

        // return early if no data found
        if (!data || data.length === 0) {
            return NextResponse.json({
                data: [],
                pagination: {
                    page,
                    limit,
                    total: 0,
                    totalPages: 0,
                    hasNext: false,
                    hasPrev: false,
                },
            });
        }

        return NextResponse.json({
            data,
            pagination: {
                page,
                limit,
                total: total[0]?.count || 0,
                totalPages: Math.ceil((total[0]?.count || 0) / limit),
                hasNext: offset + limit < (total[0]?.count || 0),
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching queries:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
