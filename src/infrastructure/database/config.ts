const DATABASE_URL = process.env.DATABASE_URL?.trim() ?? "";
const DATABASE_HOST = process.env.DATABASE_HOST?.trim() ?? "";
const DATABASE_PORT = process.env.DATABASE_PORT?.trim() ?? "";
const DATABASE_NAME = process.env.DATABASE_NAME?.trim() ?? "";
const DATABASE_USERNAME = process.env.DATABASE_USERNAME?.trim() ?? "";
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD?.trim() ?? "";

export const DATABASE_CONFIG_ERROR =
  "Database is not configured. Set DATABASE_URL or the DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, and DATABASE_PASSWORD variables.";

export function isDatabaseConfigured() {
  return Boolean(DATABASE_URL || buildDatabaseConnectionString());
}

function buildDatabaseConnectionString() {
  if (
    !DATABASE_HOST ||
    !DATABASE_PORT ||
    !DATABASE_NAME ||
    !DATABASE_USERNAME ||
    !DATABASE_PASSWORD
  ) {
    return "";
  }

  const credentials = `${encodeURIComponent(DATABASE_USERNAME)}:${encodeURIComponent(DATABASE_PASSWORD)}@`;

  return `postgresql://${credentials}${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}?sslmode=require`;
}

export function getDatabaseConnectionString() {
  return DATABASE_URL || buildDatabaseConnectionString();
}

export function assertDatabaseConfig() {
  if (!getDatabaseConnectionString()) {
    throw new Error(DATABASE_CONFIG_ERROR);
  }
}

export const databaseConfig = {
  url: DATABASE_URL,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  name: DATABASE_NAME,
  username: DATABASE_USERNAME,
};
