ALTER TYPE "public"."audit_action" ADD VALUE 'delete_attempt' BEFORE 'submit';--> statement-breakpoint
ALTER TYPE "public"."audit_action" ADD VALUE 'other';--> statement-breakpoint
ALTER TYPE "public"."audit_target" ADD VALUE 'media' BEFORE 'user';--> statement-breakpoint
ALTER TYPE "public"."audit_target" ADD VALUE 'system';--> statement-breakpoint
ALTER TYPE "public"."audit_target" ADD VALUE 'email';--> statement-breakpoint
ALTER TYPE "public"."audit_target" ADD VALUE 'other';