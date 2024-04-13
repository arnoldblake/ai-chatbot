import type { PageServerLoad } from './$types';
import { prisma } from '$lib/db';
import type { Message } from 'ai/svelte';

export const load: PageServerLoad = async ({ locals, params }) => {
    const id = params.id;
    const session = await locals.auth();
    const userId = session?.user?.id || '';
    const messages: Message[] = await prisma.message.findMany({
        where: {
            chatId: id,
            userId: userId
        },
        orderBy: {
            createdAt: 'asc'
        },
        select: {
            id: true,
            role: true,
            content: true,
            createdAt: true
        }
    }) as Message[];

    return { messages }
};