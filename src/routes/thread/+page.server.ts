import { fail, type Actions } from '@sveltejs/kit';
import { thread } from '$lib/schema';
import { db } from '$lib/db';
import { eq, and, sql } from 'drizzle-orm';

export const actions = {
    create: async ({ locals }) => {
        const session = await locals.auth();
        if (!session?.user?.id) {
            return fail(401, {
                error: true,
                message: 'You must be logged in.'
            });
        }
        await db
            .insert(thread)
            .values({
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userId: session.user.id
            })
    },
    delete: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user?.id) {
            return fail(401, {
                error: true,
                message: 'You must be logged in.'
            });
        }
        const formData = Object.fromEntries(await request.formData())
        console.log(formData);

        await db.delete(thread).where(
            and(
                eq(thread.userId, session.user.id),
                eq(thread.id, formData.id)
            ));
    },
    update: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session?.user?.id) {
            return fail(401, {
                error: true,
                message: 'You must be logged in.'
            });
        }
        const formData = Object.fromEntries(await request.formData())
        console.log(formData);
        const result = await db.update(thread).set({
            name: formData.name as string
        }).where(
            and(
                eq(thread.userId, session.user.id),
                eq(thread.id, formData.id)
            ))
            .returning();

        return { thread: result };
    }
} satisfies Actions