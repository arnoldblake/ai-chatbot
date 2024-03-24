import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: "./src/lib/schema.ts",
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DB_CONNECTION_STRING,
    },
    verbose: true,
    strict: true,
})