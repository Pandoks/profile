import { connect } from '@planetscale/database';
import { datetime, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import {
  ENV,
  PLANETSCALE_DATABASE_HOST,
  DEVELOPMENT_DATABASE_HOST,
  PLANETSCALE_DATABASE_USERNAME,
  DEVELOPMENT_DATABASE_USERNAME,
  PLANETSCALE_DATABASE_PASSWORD,
  DEVELOPMENT_DATABASE_PASSWORD
} from '$env/static/private';

const planetscale_connection = connect({
  host: ENV === 'production' ? PLANETSCALE_DATABASE_HOST : DEVELOPMENT_DATABASE_HOST,
  username: ENV === 'production' ? PLANETSCALE_DATABASE_USERNAME : DEVELOPMENT_DATABASE_USERNAME,
  password: ENV === 'production' ? PLANETSCALE_DATABASE_PASSWORD : DEVELOPMENT_DATABASE_PASSWORD
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
