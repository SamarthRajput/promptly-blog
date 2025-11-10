import { logAudit } from "@/actions/logAudit";
import { posts, user } from "@/db/schema";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// DELETE method for soft deleting posts
export async function DELETE(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser || !clerkUser.id) {
            return NextResponse.json({ error: "Unauthorized, please log in." }, { status: 401 });
        }
        const postId = (await params).id;

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required." }, { status: 400 });
        }

        // Find author
        const authorResult = await db.select().from(user).where(eq(user.clerkId, clerkUser.id));
        if (!authorResult || authorResult.length === 0) {
            return NextResponse.json({ error: "Author not found." }, { status: 404 });
        }

        // Check if post exists and user owns it
        const existingPost = await db.select()
            .from(posts)
            .where(and(eq(posts.id, postId), eq(posts.authorId, authorResult[0].id)))
            .limit(1);

        if (existingPost.length === 0) {
            logAudit(authorResult[0].id, 'post', postId, 'delete', {
                success: false,
                message: `Failed delete attempt for post ${postId} by user ${authorResult[0].id}`
            });
            return NextResponse.json({ error: "Post not found or access denied." }, { status: 404 });
        }

        // Soft delete
        await db.update(posts)
            .set({
                deletedAt: new Date(),
                updatedAt: new Date()
            })
            .where(eq(posts.id, postId));
        logAudit(authorResult[0].id, 'post', postId, 'delete', {
            success: true,
            message: `Post ${postId} soft-deleted by user ${authorResult[0].id}`
        });

        return NextResponse.json({
            success: true,
            message: "Post deleted successfully."
        });

    } catch (error: any) {
        console.error("Error deleting post:", error);
        return NextResponse.json({
            error: "Failed to delete post.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

export async function PUT(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser || !clerkUser.id) {
            return NextResponse.json({ error: "Unauthorized, please log in." }, { status: 401 });
        }
        
        const postId = (await params).id;
        if (!postId) {
            return NextResponse.json({ error: "Post ID is required." }, { status: 400 });
        }

        const authorResult = await db.select().from(user).where(eq(user.clerkId, clerkUser.id));
        if (!authorResult || authorResult.length === 0) {
            return NextResponse.json({ error: "Author not found." }, { status: 404 });
        }
        const dbUserId = authorResult[0].id;

        const { title, contentMd, coverImageId, status, scheduledAt, categoryId } = await request.json();
        
        let scheduledAtValue: Date | null = null;
        if (scheduledAt) {
            const dateObj = new Date(scheduledAt);
            scheduledAtValue = isNaN(dateObj.getTime()) ? null : dateObj;
        }

        const coverImageIdValue = coverImageId && coverImageId.trim() !== '' ? coverImageId : null;

        if (!title || !contentMd) {
            await logAudit(dbUserId, 'post', postId, 'update', {
                success: false,
                message: `Failed update attempt for post ${postId} - missing title or content`
            });
            return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
        }

        let statusDB;
        if (status && status === 'published') {
            statusDB = 'under_review';
        } else if (status && (status === 'draft' || status === 'scheduled' || status === 'under_review' || status === 'approved')) {
            statusDB = status;
        } else {
            await logAudit(dbUserId, 'post', postId, 'update', {
                success: false,
                message: `Failed update attempt for post ${postId} - invalid status: ${status}`
            });
            return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
        }

        const existingPost = await db.select()
            .from(posts)
            .where(and(eq(posts.id, postId), eq(posts.authorId, dbUserId)))
            .limit(1);

        if (existingPost.length === 0) {
            await logAudit(dbUserId, 'post', postId, 'update', {
                success: false,
                message: `Failed update attempt for post ${postId} - post not found or access denied`
            });
            return NextResponse.json({ error: "Post not found or access denied." }, { status: 404 });
        }

        // Update the post
        const updateResult = await db.update(posts)
            .set({
                title,
                contentMd,
                coverImageId: coverImageIdValue,
                status: statusDB,
                scheduledAt: scheduledAtValue,
                updatedAt: new Date()
            })
            .where(eq(posts.id, postId))
            .returning();

        await logAudit(dbUserId, 'post', postId, 'update', {
            success: true,
            message: `Post ${postId} updated successfully`
        });

        return NextResponse.json({
            success: true,
            post: updateResult[0],
            message: "Post updated successfully."
        });

    } catch (error: any) {
        console.error("Error updating post:", error);
        return NextResponse.json({
            error: "Failed to update post.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}