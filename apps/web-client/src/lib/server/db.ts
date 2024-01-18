import { connect } from '@planetscale/database';
import { datetime, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

const ENV = process.env.ENV || 'sandbox';
const PLANETSCALE_DATABASE_HOST =
  ENV === 'production'
    ? process.env.PLANETSCALE_DATABASE_HOST
    : process.env.DEVELOPMENT_DATABASE_HOST;
const PLANETSCALE_DATABASE_USERNAME =
  ENV === 'production'
    ? process.env.PLANETSCALE_DATABASE_USERNAME
    : process.env.DEVELOPMENT_DATABASE_USERNAME;
const PLANETSCALE_DATABASE_PASSWORD =
  ENV === 'production'
    ? process.env.PLANETSCALE_DATABASE_PASSWORD
    : process.env.DEVELOPMENT_DATABASE_PASSWORD;

const planetscale_connection = connect({
  host: PLANETSCALE_DATABASE_HOST,
  username: PLANETSCALE_DATABASE_USERNAME,
  password: PLANETSCALE_DATABASE_PASSWORD
});
export const db = drizzle(planetscale_connection);

export const users = mysqlTable('users', {
  id: varchar('id', {
    length: 255
  }).primaryKey(),
  username: text('username').notNull().unique(),
  hashedPassword: text('hashed_password').notNull()
});

export const sessions = mysqlTable('sessions', {
  id: varchar('id', {
    length: 255
  }).primaryKey(),
  userId: varchar('user_id', {
    length: 255
  })
    .notNull()
    .references(() => users.id),
  expiresAt: datetime('expires_at').notNull()
});
