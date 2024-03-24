import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { DB_CONNECTION_STRING } from '$env/static/private';

const client = new Client({
    connectionString: DB_CONNECTION_STRING
});

await client.connect();
export const db = drizzle(client);