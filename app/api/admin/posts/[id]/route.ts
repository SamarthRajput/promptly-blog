// app/api/admin/posts/[id]/route.ts
import { NextResponse } from "next/server";
import { posts, approvalLog, media, user, postCollaborators, postCategories, postTags, comments, postReactions, postRevisions } from "@/db/schema";
import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/actions/syncUser";
import { currentUser } from "@clerk/nextjs/server";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
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
        const adminId = existingUser.id;

        const { action, reason, scheduledAt } = await req.json();
        const postId = params.id;

        let updateData: any = {};
        let statusChange: string | null = null;

        switch (action) {
            case "approve":
                statusChange = "approved";
                updateData.status = "approved";
                updateData.approvedAt = new Date();
                break;

            case "reject":
                statusChange = "rejected";
                updateData.status = "rejected";
                updateData.rejectionReason = reason || "No reason provided";
                break;

            case "schedule":
                statusChange = "scheduled";
                updateData.status = "scheduled";
                updateData.scheduledAt = new Date(scheduledAt);
                break;

            case "publish":
                statusChange = "published";
                updateData.status = "published";
                updateData.publishedAt = new Date();
                break;

            case "archive":
                statusChange = "archived";
                updateData.status = "archived";
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }

        // Update the post
        await db
            .update(posts)
            .set(updateData)
            .where(eq(posts.id, postId));

        // Add to approval log
        if (statusChange) {
            await db.insert(approvalLog).values({
                postId: postId,
                decidedByUserId: adminId,
                decision: statusChange as
                    | "draft"
                    | "under_review"
                    | "approved"
                    | "scheduled"
                    | "rejected"
                    | "archived",
                reason: reason || null,
            });
        }

        return NextResponse.json({ success: true, action: statusChange });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to perform action" }, { status: 500 });
    }
}

export async function GET(req: Request,
    { params }: { params: { id: string } }
) {
    console.log("\n\nFetching post for admin with ID:", params.id);
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

        const postId = params.id;
        const post = await db.select({
            post: posts,
            author: user,
            collaborators: postCollaborators,
            categories: postCategories,
            tags: postTags,
            comments: comments,
            reactions: postReactions,
            revisions: postRevisions,
            auditLog: approvalLog,
            media: media,
        }).from(posts)
            .leftJoin(user, eq(posts.authorId, user.id))
            .leftJoin(postCollaborators, eq(posts.id, postCollaborators.postId))
            .leftJoin(postCategories, eq(posts.id, postCategories.postId))
            .leftJoin(postTags, eq(posts.id, postTags.postId))
            .leftJoin(comments, eq(posts.id, comments.postId))
            .leftJoin(postReactions, eq(posts.id, postReactions.postId))
            .leftJoin(postRevisions, eq(posts.id, postRevisions.postId))
            .leftJoin(approvalLog, eq(posts.id, approvalLog.postId))
            .leftJoin(media, eq(posts.coverImageId, media.id))
            .where(eq(posts.id, postId))
            .limit(1);

        return NextResponse.json({
            data: post,
            success: true,
            message: "Post fetched successfully"
        });
    } catch (error) {
        console.error(`Error fetching posts for admin: ${error}`);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}