import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "$lib/schema"
import pg from "pg";
import { DB_CONNECTION_STRING } from '$env/static/private';

const { Pool } = pg;

const pool = new Pool({
    connectionString: DB_CONNECTION_STRING
});

export const db = drizzle(pool, { schema });