ALTER TABLE "contact_queries" ADD COLUMN "reply" text;--> statement-breakpoint
ALTER TABLE "contact_queries" ADD COLUMN "replied_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "contact_queries" ADD COLUMN "replied_by" uuid;--> statement-breakpoint
ALTER TABLE "contact_queries" ADD CONSTRAINT "contact_queries_replied_by_user_id_fk" FOREIGN KEY ("replied_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;