import { pgTable, text, timestamp, uuid, jsonb, primaryKey, integer } from "drizzle-orm/pg-core"
import { vector } from 'pgvector/drizzle-orm'
import { sql } from "drizzle-orm"

// export const pgVectorStore = pgTable("pg_vector_store", {
// 	id: uuid("id").defaultRandom().primaryKey().notNull(),
// 	content: text("content"),
// 	metadata: jsonb("metadata"),
// 	vector: vector("vector", { dimension: 512 }).notNull(),
// 	fileId: integer("fileId").notNull().references(() => pgDocumentStore.id, { onDelete: "cascade" }),
// });

export const pgDocumentStore = pgTable("pg_document_store", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	filename: text("filename").notNull(),
	size: integer("size").notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const thread = pgTable("thread", {
	id: text("id").primaryKey().notNull(),
	createdAt: timestamp("createdAt", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }).notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
	name: text("name").notNull().default("New Thread")
});

export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
});

export const session = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
});


export const verificationToken = pgTable("verificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
	(table) => {
		return {
			verificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk" })
		}
	});

export const account = pgTable("account", {
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
	(table) => {
		return {
			accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk" })
		}
	});