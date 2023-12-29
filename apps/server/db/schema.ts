import { datetime, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
});

export const sessions = mysqlTable("sessions", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => users.id),
  expiresAt: datetime("expires_at").notNull(),
});
