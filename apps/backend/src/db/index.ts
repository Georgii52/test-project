import { drizzle, NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { Pool } from "pg";
import { PgDatabase } from "drizzle-orm/pg-core";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
  allowExitOnIdle: true,
});

pool.on("error", (err) => {
  console.log("[PG-POOL] idle client error: ", err.message);
});

export const database = drizzle(pool, { schema });

export type Database = PgDatabase<NodePgQueryResultHKT, typeof schema>;
