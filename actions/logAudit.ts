import { auditLogs } from "@/db/schema";
import { db } from "@/lib/db";

type AuditAction =
    | "create"
    | "update"
    | "delete"
    | "delete_attempt"
    | "submit"
    | "approve"
    | "reject"
    | "publish"
    | "archive"
    | "invite"
    | "invite_accept"
    | "invite_decline"
    | "invite_revoke"
    | "login"
    | "logout"
    | "other";

type targetType = "user" | "post" | "comment" | "invitation" | "approval" | "system" | "email" | "media" | "other";

export async function logAudit(
    actorUserId: string,
    targetType: targetType,
    targetId: string,
    action: AuditAction,
    metadata: any = {}
) {
    await db.insert(auditLogs).values({
        actorUserId,
        targetType,
        targetId,
        action,
        metadata,
    });
}
