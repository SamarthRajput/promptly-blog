// app/api/admin/users/[id]/route.ts
import { getCurrentUser } from "@/actions/syncUser";
import { posts, user, comments, postReactions, postCollaborators, collaborationInvites, auditLogs } from "@/db/schema";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { eq, count, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser || !clerkUser.id) {
            return NextResponse.json({ error: "Unauthorized, please log in." }, { status: 401 });
        }
        const existingUser = await getCurrentUser();
        if (!existingUser || existingUser.siteRole !== "admin") {
            return NextResponse.json({ error: "Access Denied. Admins only." }, { status: 403 });
        }
        // get id
        const { searchParams } = request.nextUrl;
        const userId = searchParams.get("id");
        if (!userId) {
            return NextResponse.json({ error: "User ID is required." }, { status: 400 });
        }
        const userInfo = await db.select().from(user).where(eq(user.id, userId as string)).execute();
        if (!userInfo.length) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const u = userInfo[0];

        // Fetch authored posts
        const authoredPosts = await db.select().from(posts).where(eq(posts.authorId, u.id)).execute();

        // Fetch collaborations
        const collaborations = await db
            .select()
            .from(postCollaborators)
            .where(eq(postCollaborators.userId, u.id))
            .execute();

        // Fetch comments
        const userComments = await db.select().from(comments).where(eq(comments.userId, u.id)).execute();

        // Fetch reactions
        const userReactions = await db.select().from(postReactions).where(eq(postReactions.userId, u.id)).execute();

        // Fetch invites
        const invites = await db.select().from(collaborationInvites).where(eq(collaborationInvites.inviterId, u.id)).execute();

        // Fetch audit logs
        const logs = await db
            .select()
            .from(auditLogs)
            .where(eq(auditLogs.actorUserId, u.id))
            .orderBy(desc(auditLogs.createdAt))
            .execute();

        NextResponse.json({
            user: u,
            authoredPostsCount: authoredPosts.length,
            collaborationsCount: collaborations.length,
            commentsCount: userComments.length,
            reactionsCount: userReactions.length,
            invitesCount: invites.length,
            auditLogs: logs,
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

interface Params {
    params: { id: string };
}
// Update User role (admin/user)
export async function PUT(
    request: NextRequest,
    paramsPromise: Promise<Params>
): Promise<NextResponse> {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser || !clerkUser.id) {
            return NextResponse.json({ error: "Unauthorized, please log in." }, { status: 401 });
        }
        const existingUser = await getCurrentUser();
        if (!existingUser || existingUser.siteRole !== "admin") {
            return NextResponse.json({ error: "Access Denied. Admins only." }, { status: 403 });
        }
        // get id from URL : /api/admin/users/[id]
        const { params } = await paramsPromise;
        const userId = params.id;
        if (!userId) {
            console.error("User ID is required.");
            return NextResponse.json({ error: "User ID is required." }, { status: 400 });
        }
        const body = await request.json();
        const { siteRole } = body;
        if (!siteRole || (siteRole !== "admin" && siteRole !== "user")) {
            return NextResponse.json({ error: "Invalid siteRole. Must be 'admin' or 'user'." }, { status: 400 });
        }
        const userInfo = await db.select().from(user).where(eq(user.id, userId as string)).execute();
        if (!userInfo.length) return NextResponse.json({ message: "User not found" }, { status: 404 });
        const u = userInfo[0];
        await db.update(user).set({ siteRole }).where(eq(user.id, u.id)).execute();
        return NextResponse.json({
            message: "User role updated successfully.",
            user: { ...u, siteRole }
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}