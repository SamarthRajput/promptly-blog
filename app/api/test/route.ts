// app/api/test/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
    auditLogs,
    commentReactions,
    postReactions,
    comments,
    postTags,
    tags,
    postCategories,
    categories,
    postRevisions,
    approvalLog,
    collaborationInvites,
    postCollaborators,
    posts,
    media,
    user,
} from "@/db/schema";

export async function DELETE() {
    try {
        // Delete children first → then parents
        await db.delete(auditLogs);
        console.log("Audit logs cleared");
        await db.delete(commentReactions);
        console.log("Comment reactions cleared");
        await db.delete(postReactions);
        console.log("Post reactions cleared");
        await db.delete(comments);
        console.log("Comments cleared");
        await db.delete(postTags);
        console.log("Post tags cleared");
        await db.delete(tags);
        console.log("Tags cleared");
        await db.delete(postCategories);
        console.log("Post categories cleared");
        await db.delete(categories);
        console.log("Categories cleared");
        await db.delete(postRevisions);
        console.log("Post revisions cleared");
        await db.delete(approvalLog);
        console.log("Approval log cleared");
        await db.delete(collaborationInvites);
        console.log("Collaboration invites cleared");
        await db.delete(postCollaborators);
        console.log("Post collaborators cleared");
        await db.delete(posts);
        console.log("Posts cleared");
        await db.delete(media);
        console.log("Media cleared");
        await db.delete(user);
        console.log("Users cleared");
        console.log("Database cleared successfully");

        return NextResponse.json({ message: "Database cleared successfully" });
    } catch (err) {
        console.error("Error clearing database:", err);
        return NextResponse.json(
            { error: "Failed to clear database" },
            { status: 500 }
        );
    }
}

export async function GET() {
    //return everything in the db
    try {
        const users = await db.select().from(user);
        const postsData = await db.select().from(posts);
        const commentsData = await db.select().from(comments);
        const tagsData = await db.select().from(tags);
        const categoriesData = await db.select().from(categories);
        const mediaData = await db.select().from(media);
        const auditLogsData = await db.select().from(auditLogs);
        
        return NextResponse.json({
            users,
            posts: postsData,
            comments: commentsData,
            tags: tagsData,
            categories: categoriesData,
            media: mediaData,
            auditLogs: auditLogsData,
        });
    } catch (err) {
        console.error("Error fetching data:", err);
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 }
        );
    }
}