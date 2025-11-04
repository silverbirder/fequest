import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * Shared Drizzle schema for Fequest applications.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `fequest_${name}`);

export const featureRequestStatuses = [
  "pending",
  "in_progress",
  "completed",
  "rejected",
] as const;

export type FeatureRequestStatus = (typeof featureRequestStatuses)[number];

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("fe_post_created_by_idx").on(t.createdById),
    index("fe_post_name_idx").on(t.name),
  ],
);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
}));

export const products = createTable(
  "product",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("fe_product_user_id_idx").on(t.userId),
    index("fe_product_name_idx").on(t.name),
  ],
);

export const featureRequests = createTable(
  "feature_request",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    productId: d
      .integer()
      .notNull()
      .references(() => products.id),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    status: d
      .varchar({ length: 32 })
      .$type<FeatureRequestStatus>()
      .notNull()
      .default("pending"),
    content: d.text().notNull(),
    likes: d.integer().default(0).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("fe_feature_request_product_id_idx").on(t.productId),
    index("fe_feature_request_user_id_idx").on(t.userId),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  products: many(products),
  featureRequests: many(featureRequests),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, { fields: [products.userId], references: [users.id] }),
  featureRequests: many(featureRequests),
}));

export const featureRequestsRelations = relations(
  featureRequests,
  ({ one }) => ({
    product: one(products, {
      fields: [featureRequests.productId],
      references: [products.id],
    }),
    user: one(users, {
      fields: [featureRequests.userId],
      references: [users.id],
    }),
  }),
);

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("fe_account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("fe_session_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
