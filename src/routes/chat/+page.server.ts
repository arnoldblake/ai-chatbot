import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/db';

async function loadThreads(id: string) {
	// Get all of the threads for the user
	let threads = await prisma.chat.findMany({
		where: {
			userId: {
				equals: id
			}
		},
		orderBy: {
			updatedAt: 'desc'
		}
	});

	// If there are no threads ie a brand new user, create one
	let thread;
	if (threads.length === 0) {
		thread = await prisma.chat.create({
			data: {
				userId: id
			}
		});
		threads = [thread];
	}
	return threads;
}

async function loadMessages(id: string) {
	// Get all messages for the thread
	const messages = await prisma.message.findMany({
		where: {
			chatId: {
				equals: id
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
	const threads = await loadThreads(userId);
	// Get all messages for the first thread
	const messages = await loadMessages(threads[0].id);
	// Get all files for the user
	const files = await loadFiles(userId);

	return { files, threads, messages };
};

export const actions = {
	create: async ({ locals }) => {
		const session = await locals.auth();

		await prisma.thread.create({
			data: {
				userId: session?.user?.id || ''
			}
		});
	},
	read: async ({ request, locals }) => {
		const session = await locals.auth();
		const formData = Object.fromEntries(await request.formData());

		await prisma.chat.update({
			where: {
				id: formData.id as string,
				userId: session?.user?.id
			},
			data: {
				updatedAt: new Date()
			}
		});
	},
	update: async ({ request, locals }) => {
		const session = await locals.auth();
		const formData = Object.fromEntries(await request.formData());

		await prisma.chat.update({
			where: {
				id: formData.id as string,
				userId: session?.user?.id
			},
			data: {
				name: formData.name as string
			}
		});
	},
	delete: async ({ request, locals }) => {
		const session = await locals.auth();
		const formData = Object.fromEntries(await request.formData());
		await prisma.chat.delete({
			where: {
				id: formData.id as string,
				AND: {
					userId: session?.user?.id
				}
			}
		});
	}
} satisfies Actions;
