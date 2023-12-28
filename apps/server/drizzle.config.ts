import { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const ENV = process.env.PLAID_ENV || "sandbox";
const PLANETSCALE_DATABASE = process.env.PLANETSCALE_DATABASE || "profile";
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

if (!PLANETSCALE_DATABASE_HOST) {
  throw new Error("PLANETSCALE_DATABASE_HOST is not defined");
} else if (!PLANETSCALE_DATABASE_USERNAME) {
  throw new Error("PLANETSCALE_DATABASE_USERNAME is not defined");
} else if (!PLANETSCALE_DATABASE_PASSWORD) {
  throw new Error("PLANETSCALE_DATABASE_PASSWORD is not defined");
}

const PLANETSCALE_DATABASE_URL = `mysql://${PLANETSCALE_DATABASE_USERNAME}:${PLANETSCALE_DATABASE_PASSWORD}@${PLANETSCALE_DATABASE_HOST}/${PLANETSCALE_DATABASE}?ssl={"rejectUnauthorized":true}`;
if (!PLANETSCALE_DATABASE_URL) {
  throw new Error("PLANETSCALE_DATABASE_URL is not defined");
}

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  driver: "mysql2",
  dbCredentials: {
    uri: PLANETSCALE_DATABASE_URL,
  },
} satisfies Config;
