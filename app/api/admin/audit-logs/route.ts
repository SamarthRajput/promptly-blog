import { db } from "@/lib/db"; // your Drizzle db instance
import {
    auditLogs,
    user,
    posts,
    comments,
    collaborationInvites,
} from "@/db/schema";
import { getCurrentUser } from "@/actions/syncUser";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm/sql/expressions/conditions";

async function getAuditLogs({ page = 1, pageSize = 20, filters = {} }) {
    const offset = (page - 1) * pageSize;

    // Base query: join actor user
    const logs = await db
        .select({
            id: auditLogs.id,
            action: auditLogs.action,
            createdAt: auditLogs.createdAt,
            metadata: auditLogs.metadata,

            // Actor info
            actorId: user.id,
            actorName: user.name,
            actorEmail: user.email,
            actorAvatar: user.avatarUrl,
            actorRole: user.siteRole,

            // Target info
            targetType: auditLogs.targetType,
            targetId: auditLogs.targetId,
            postTitle: posts.title,
            postSlug: posts.slug,
            postCoverImage: posts.coverImageId, // optional
            commentExcerpt: comments.content,
            inviteeEmail: collaborationInvites.inviteeEmail,
        })
        .from(auditLogs)
        .leftJoin(user, eq(auditLogs.actorUserId, user.id))
        .leftJoin(posts, eq(posts.id, auditLogs.targetId).and(eq(auditLogs.targetType, "post")))
        .leftJoin(comments, eq(comments.id, auditLogs.targetId).and(eq(auditLogs.targetType, "comment")))
        .leftJoin(
            collaborationInvites,
            eq(collaborationInvites.id, auditLogs.targetId) and(eq(auditLogs.targetType, "invitation")))
        )
        .where((clause) => {
            // Apply filters dynamically
            if (filters.actorId) clause.and(eq(auditLogs.actorUserId, filters.actorId));
            if (filters.targetType) clause.and(eq(auditLogs.targetType,(filters.targetType));
            if (filters.action) clause.and(auditLogs.action.eq(filters.action));
            if (filters.startDate) clause.and(auditLogs.createdAt.gte(filters.startDate));
            if (filters.endDate) clause.and(auditLogs.createdAt.lte(filters.endDate));
        })
        .orderBy(auditLogs.createdAt.desc())
        .limit(pageSize)
        .offset(offset);

    // Map data for frontend
    const formattedLogs = logs.map((log) => {
        let target: any = { id: log.targetId, type: log.targetType };

        if (log.targetType === "post") {
            target.title = log.postTitle;
            target.slug = log.postSlug;
            target.url = `/posts/${log.postSlug}`;
            // you can also fetch coverImage URL if needed separately
        } else if (log.targetType === "comment") {
            target.excerpt = log.commentExcerpt?.slice(0, 100); // first 100 chars
            target.url = `/posts/${log.postSlug ?? ""}#comment-${log.targetId}`;
        } else if (log.targetType === "user") {
            target.name = log.actorName;
            target.email = log.actorEmail;
            target.avatar = log.actorAvatar;
        } else if (log.targetType === "invitation") {
            target.email = log.inviteeEmail;
        }

        return {
            id: log.id,
            action: log.action,
            createdAt: log.createdAt,
            metadata: log.metadata,
            actor: {
                id: log.actorId,
                name: log.actorName,
                email: log.actorEmail,
                avatarUrl: log.actorAvatar,
                siteRole: log.actorRole,
            },
            target,
        };
    });

    // Optional: fetch total count for pagination
    const total = await db.count(auditLogs.id).where((clause) => {
        if (filters.actorId) clause.and(auditLogs.actorUserId.eq(filters.actorId));
        if (filters.targetType) clause.and(auditLogs.targetType.eq(filters.targetType));
        if (filters.action) clause.and(auditLogs.action.eq(filters.action));
        if (filters.startDate) clause.and(auditLogs.createdAt.gte(filters.startDate));
        if (filters.endDate) clause.and(auditLogs.createdAt.lte(filters.endDate));
    });

    return {
        data: formattedLogs,
        meta: {
            page,
            pageSize,
            total: Number(total),
            totalPages: Math.ceil(Number(total) / pageSize),
        },
    };
}

export async function GET(request: Request) {
    try {
        // Check if user is logged in
        const clerkUser = await currentUser();
        if (!clerkUser?.id) {
            return NextResponse.json(
                { error: "Unauthorized, please log in." },
                { status: 401 }
            );
        }

        // Check if user is admin
        const existingUser = await getCurrentUser();
        if (!existingUser || existingUser.siteRole !== "admin") {
            return NextResponse.json(
                { error: "Access Denied. Admins only." },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
        // filter params
        const actorId = searchParams.get("actorId") || undefined;
        const targetType = searchParams.get("targetType") || undefined;
        const action = searchParams.get("action") || undefined;
        const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
        const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;
        const filters: any = {};
        if (actorId) filters.actorId = actorId;
        if (targetType) filters.targetType = targetType;
        if (action) filters.action = action;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        const auditLogs = await getAuditLogs({ page, pageSize, filters });
        return NextResponse.json(auditLogs);
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch audit logs." },
            { status: 500 }
        );
    }
}
