import { connect } from '@planetscale/database';
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
