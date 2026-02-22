CREATE TABLE "fequest_product_watcher" (
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"productId" integer NOT NULL,
	"userId" varchar(255) NOT NULL,
	CONSTRAINT "fequest_product_watcher_productId_userId_pk" PRIMARY KEY("productId","userId")
);
--> statement-breakpoint
ALTER TABLE "fequest_admin_user" ADD COLUMN "webhookUrl" varchar(2048);--> statement-breakpoint
ALTER TABLE "fequest_user" ADD COLUMN "webhookUrl" varchar(2048);--> statement-breakpoint
ALTER TABLE "fequest_product_watcher" ADD CONSTRAINT "fequest_product_watcher_productId_fequest_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."fequest_product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fequest_product_watcher" ADD CONSTRAINT "fequest_product_watcher_userId_fequest_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."fequest_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fe_product_watcher_product_id_idx" ON "fequest_product_watcher" USING btree ("productId");--> statement-breakpoint
CREATE INDEX "fe_product_watcher_user_id_idx" ON "fequest_product_watcher" USING btree ("userId");