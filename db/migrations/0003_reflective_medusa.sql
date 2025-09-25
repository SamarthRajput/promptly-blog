ALTER TABLE "approval_log" ALTER COLUMN "decision" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'under_review'::text;--> statement-breakpoint
DROP TYPE "public"."post_status";--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'under_review', 'approved', 'scheduled', 'rejected', 'archived');--> statement-breakpoint
ALTER TABLE "approval_log" ALTER COLUMN "decision" SET DATA TYPE "public"."post_status" USING "decision"::"public"."post_status";--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'under_review'::"public"."post_status";--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "status" SET DATA TYPE "public"."post_status" USING "status"::"public"."post_status";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "visibility";--> statement-breakpoint
DROP TYPE "public"."visibility";