// app/api/admin/queries/[id]/route.ts
import { db } from "@/lib/db";
import { contactQueries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/actions/syncUser";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { logAudit } from "@/actions/logAudit";

// PATCH: update status
export async function PATCH(req: Request,
    { params }: { params: Promise<{ id: string }> }) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser?.id) {
            return NextResponse.json({ error: "Unauthorized, please log in." }, { status: 401 });
        }

        const existingUser = await getCurrentUser();
        if (!existingUser || existingUser.siteRole !== "admin") {
            return NextResponse.json({ error: "Access Denied. Admins only." }, { status: 403 });
        }

        const body = await req.json();
        const { status, reply } = body;

        if (!["in_progress", "resolved"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        if (reply && typeof reply !== 'string') {
            return NextResponse.json({ error: "Reply must be a non-empty string" }, { status: 400 });
        }
        if (reply && reply.trim().length === 0) {
            return NextResponse.json({ error: "Reply cannot be empty" }, { status: 400 });
        }

        const updated = await db
            .update(contactQueries)
            .set({ status, reply, repliedAt: new Date(), repliedBy: existingUser.id })
            .where(eq(contactQueries.id, (await params).id))
            .returning();

        if (!updated.length) {
            return NextResponse.json({ error: "Query not found" }, { status: 404 });
        }
        // Send Email to user notifying them of the status change and reply (if any)
        if (existingUser.email) {
            // await sendEmail({
            //     to: existingUser.email,
            //     subject: "Your query status has been updated",
            //     text: `Your query status has been updated to ${status}. ${reply ? `Reply: ${reply}` : ''}`
            // });
        }
        logAudit(existingUser.id, "other", updated[0].id, 'update',
            {
                previous: updated[0], current: { status, reply }
            });
        return NextResponse.json({ message: "Status updated successfully", query: updated[0] });
    } catch (error) {
        console.error("Error updating query:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: remove query
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser?.id) {
            return NextResponse.json({ error: "Unauthorized, please log in." }, { status: 401 });
        }

        const existingUser = await getCurrentUser();
        if (!existingUser || existingUser.siteRole !== "admin") {
            return NextResponse.json({ error: "Access Denied. Admins only." }, { status: 403 });
        }

        const deleted = await db
            .delete(contactQueries)
            .where(eq(contactQueries.id, (await params).id))
            .returning();

        if (!deleted.length) {
            return NextResponse.json({ error: "Query not found" }, { status: 404 });
        }
        logAudit(existingUser.id, "other", deleted[0].id, 'delete', {
            previous: deleted[0],
            current: null,
            message: 'User Query deleted by admin'
        });

        return NextResponse.json({ message: "Query deleted successfully" });
    } catch (error) {
        console.error("Error deleting query:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
