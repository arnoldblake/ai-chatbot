import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/db';

async function loadChats(chatId: string) {
    // Get all of the threads for the user
    let chats = await prisma.chat.findMany({
        where: {
            userId: {
                equals: chatId
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    // If there are no threads ie a brand new user, create one
    let chat;
    if (chats.length === 0) {
        chat = await prisma.chat.create({
            data: {
                userId: chatId
            }
        });
        chats = [chat];
    }
    return chats;
}

async function loadMessages(chatId: string) {
    // Get all messages for the thread
    const messages = await prisma.message.findMany({
        where: {
            chatId: {
                equals: chatId
            }
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
    });
    return messages;
}

async function loadFiles(id: string) {
    // Get all files for the user
    const files = await prisma.file.findMany({
        where: {
            userId: {
                equals: id
            }
        }
    });
    return files;
}

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    const userId = session?.user?.id || '';

    // Get all threads for the user
    const chats = await loadChats(userId);
    // Get all messages for the first thread
    const messages = await loadMessages(chats[0].id);
    // Get all files for the user
    const files = await loadFiles(userId);

    return { files, chats, chat: chats[0], messages };
};

export const actions = {
    create: async ({ locals }) => {
        const session = await locals.auth();

        await prisma.chat.create({
            data: {
                userId: session?.user?.id || ''
            }
        });
    },
    read: async ({ request, locals }) => {
        const session = await locals.auth();
        const { chatId } = Object.fromEntries(await request.formData());
        const userId = session?.user?.id || '';

        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId as string,
                userId: userId
            }
        });

        const messages = await loadMessages(chat?.id as string);

        return { chat, messages };
    },
    update: async ({ request, locals }) => {
        const session = await locals.auth();
        const { chatId, chatName } = Object.fromEntries(await request.formData());
        const userId = session?.user?.id || '';

        await prisma.chat.update({
            where: {
                id: chatId as string,
                userId: userId
            },
            data: {
                name: chatName as string
            }
        });
    },
    delete: async ({ request, locals }) => {
        const session = await locals.auth();
        const { chatId } = Object.fromEntries(await request.formData());
        const userId = session?.user?.id || '';

        await prisma.chat.delete({
            where: {
                id: chatId as string,
                userId: userId
            }
        });
    }
} satisfies Actions;
