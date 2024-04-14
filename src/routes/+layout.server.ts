import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/db';

export const load: LayoutServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    const userId = session?.user?.id || '';
    // Get all of the threads for the user
    const chats = await prisma.chat.findMany({
        where: {
            userId: {
                equals: userId
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    return { session: session, chats: chats }
};