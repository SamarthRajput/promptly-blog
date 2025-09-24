// app/api/admin/posts/route.ts
import { NextResponse } from "next/server";
import { eq, desc, ilike, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { media, posts, user } from "@/db/schema";
import { getCurrentUser } from "@/actions/syncUser";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
    try {
        // Check if user is logged in
        const clerkUser = await currentUser();
        if (!clerkUser?.id) {
            return NextResponse.json({ error: "Unauthorized, please log in." }, { status: 401 });
        }

        // Check if user is admin
        const existingUser = await getCurrentUser();
        if (!existingUser || existingUser.siteRole !== "admin") {
            return NextResponse.json({ error: "Access Denied. Admins only." }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const status = searchParams.get("status");
        const author = searchParams.get("author");
        const search = searchParams.get("search");

        const offset = (page - 1) * limit;

        let whereConditions = [];

        if (status) {
            // Cast status to the correct enum type
            whereConditions.push(eq(posts.status, status as typeof posts.status._.data));
        }
        if (author) {
            whereConditions.push(eq(posts.authorId, author));
        }
        if (search) {
            whereConditions.push(ilike(posts.title, `%${search}%`));
        }

        const postsData = await db
            .select({
                id: posts.id,
                title: posts.title,
                excerpt: posts.excerpt,
                coverImage: media.url,
                status: posts.status,
                visibility: posts.visibility,
                submittedAt: posts.submittedAt,
                scheduledAt: posts.scheduledAt,
                publishedAt: posts.publishedAt,
                authorId: posts.authorId,
                authorName: user.name,
            })
            .from(posts)
            .leftJoin(user, eq(posts.authorId, user.id))
            .leftJoin(media, eq(posts.coverImageId, media.id))
            .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
            .orderBy(desc(posts.submittedAt))
            .limit(limit)
            .offset(offset);

        const total = await db.$count(posts);

        return NextResponse.json({
            data: postsData,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}