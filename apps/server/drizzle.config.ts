import { Config } from "drizzle-kit";

const ENV = process.env.PLAID_ENV || "sandbox";
const PLANETSCALE_DATABASE_HOST =
  ENV === "production"
    ? process.env.PLANETSCALE_DATABASE_HOST
    : process.env.DEVELOPMENT_DATABASE_HOST;
const PLANETSCALE_DATABASE_USERNAME =
  ENV === "production"
    ? process.env.PLANETSCALE_DATABASE_USERNAME
    : process.env.DEVELOPMENT_DATABASE_USERNAME;
const PLANETSCALE_DATABASE_PASSWORD =
  ENV === "production"
    ? process.env.PLANETSCALE_DATABASE_PASSWORD
    : process.env.DEVELOPMENT_DATABASE_PASSWORD;

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  driver: "mysql2",
  dbCredentials: {
    host: PLANETSCALE_DATABASE_HOST!,
    user: PLANETSCALE_DATABASE_USERNAME,
    password: PLANETSCALE_DATABASE_PASSWORD,
    database: "profile",
  },
} satisfies Config;
