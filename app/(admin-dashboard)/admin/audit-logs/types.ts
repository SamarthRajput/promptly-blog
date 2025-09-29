import React, { useState, useRef, useEffect } from 'react';

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

// Actor (user who performed the action)
export interface Actor {
    id: string | null;
    name: string | null;
    email: string | null;
    avatarUrl: string | null;
    siteRole: "user" | "admin" | null;
}

// Target (what the action was performed on)
interface Target {
    id: string | null;
    type: "user" | "post" | "comment" | "invitation" | "other" | "approval" | "system" | "email" | "media";
    // optional fields based on type
    title?: string | null;   // for post
    slug?: string | null;    // for post
    url?: string | null;     // for post/comment
    excerpt?: string | null; // for comment
    name?: string | null;    // for user
    email?: string | null;   // for user/invitation
    avatar?: string | null;  // for user
}

// One log entry
export interface AuditLogEntry {
    id: string;
    action:
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
    | "logout";
    createdAt: string;
    metadata: Record<string, any>;
    actor: Actor;
    target: Target;
}

export const actionLabels: Record<string, string> = {
    create: "Created",
    update: "Updated",
    delete: "Deleted",
    delete_attempt: "Delete Attempted",
    submit: "Submitted",
    approve: "Approved",
    reject: "Rejected",
    publish: "Published",
    archive: "Archived",
    invite: "Invited",
    invite_accept: "Invite Accepted",
    invite_decline: "Invite Declined",
    invite_revoke: "Invite Revoked",
    login: "Login",
    logout: "Logout",
    other: "Other",
};
