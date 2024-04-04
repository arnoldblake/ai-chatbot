import { fail } from '@sveltejs/kit';

import { db } from '$lib/db';
import { pgDocumentStore, thread } from '$lib/schema.js';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();
    if (!session?.user?.id) {
        return fail(401, {
            error: true,
            message: 'You must be logged in.'
        });
    }

    // Get all of the threads for the user
    let threads = await db.select({
        id: thread.id,
        name: thread.name,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt
    }).from(thread).where(eq(thread.userId, session.user.id));

    // If there are no threads ie a brand new user, create one
    if (threads.length === 0) {
        threads = await db
            .insert(thread)
            .values({
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userId: session.user.id
            })
            .returning()
            .onConflictDoUpdate({
                target: thread.id,
                set: { updatedAt: new Date().toISOString() }
            });
    };

    // Get all files for the user
    const files = await db.select({
        filename: pgDocumentStore.filename,
        size: pgDocumentStore.size,
        id: pgDocumentStore.id
    }).from(pgDocumentStore).where(eq(pgDocumentStore.userId, session.user.id)) || [];
    return { files, threads };
};