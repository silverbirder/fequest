CREATE TABLE "fequest_admin_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "fequest_admin_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "fequest_admin_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fequest_admin_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "fequest_admin_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "fequest_admin_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
INSERT INTO "fequest_admin_user" ("id", "name", "email", "emailVerified", "image")
SELECT DISTINCT "fequest_user"."id", "fequest_user"."name", "fequest_user"."email", "fequest_user"."emailVerified", "fequest_user"."image"
FROM "fequest_user"
INNER JOIN "fequest_product" ON "fequest_product"."userId" = "fequest_user"."id";
--> statement-breakpoint
INSERT INTO "fequest_admin_account" ("userId", "type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state")
SELECT "fequest_account"."userId", "fequest_account"."type", "fequest_account"."provider", "fequest_account"."providerAccountId", "fequest_account"."refresh_token", "fequest_account"."access_token", "fequest_account"."expires_at", "fequest_account"."token_type", "fequest_account"."scope", "fequest_account"."id_token", "fequest_account"."session_state"
FROM "fequest_account"
INNER JOIN "fequest_admin_user" ON "fequest_admin_user"."id" = "fequest_account"."userId";
--> statement-breakpoint
ALTER TABLE "fequest_product" DROP CONSTRAINT "fequest_product_userId_fequest_user_id_fk";
--> statement-breakpoint
ALTER TABLE "fequest_admin_account" ADD CONSTRAINT "fequest_admin_account_userId_fequest_admin_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."fequest_admin_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fequest_admin_session" ADD CONSTRAINT "fequest_admin_session_userId_fequest_admin_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."fequest_admin_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fe_admin_account_user_id_idx" ON "fequest_admin_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "fe_admin_session_user_id_idx" ON "fequest_admin_session" USING btree ("userId");--> statement-breakpoint
ALTER TABLE "fequest_product" ADD CONSTRAINT "fequest_product_userId_fequest_admin_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."fequest_admin_user"("id") ON DELETE no action ON UPDATE no action;
