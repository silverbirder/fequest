CREATE TABLE "fequest_feature_request_admin_comment" (
	"featureRequestId" integer PRIMARY KEY NOT NULL,
	"adminUserId" varchar(255),
	"content" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "fequest_feature_request_admin_comment" ADD CONSTRAINT "fequest_feature_request_admin_comment_featureRequestId_fequest_feature_request_id_fk" FOREIGN KEY ("featureRequestId") REFERENCES "public"."fequest_feature_request"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fequest_feature_request_admin_comment" ADD CONSTRAINT "fequest_feature_request_admin_comment_adminUserId_fequest_admin_user_id_fk" FOREIGN KEY ("adminUserId") REFERENCES "public"."fequest_admin_user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fe_feature_request_admin_comment_user_id_idx" ON "fequest_feature_request_admin_comment" USING btree ("adminUserId");