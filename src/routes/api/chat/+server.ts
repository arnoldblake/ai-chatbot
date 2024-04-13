import type { RequestHandler } from './$types';
import { StreamingTextResponse } from 'ai';
import { stream } from '$lib/helpfull_ai';
import { prisma } from '$lib/db';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth();
	const { messages, chatId } = await request.json();
	const userId = session?.user?.id || '';

	// If the chatId is empty, create a new chat
	let chat;
	if (chatId === '') {
		chat = await prisma.chat.create({
			data: {
				userId: userId
			}
		});
	}

	if (!chat) return new Response('Chat not found', { status: 404 });

	// Get the most recent message, assuming its the last one
	const message = messages[messages.length - 1];

	// Save the message to the database
	await prisma.message.create({
		data: {
			role: message.role,
			content: message.content,
			chatId: chat.id,
			userId: userId
		}
	});

	// Prompt the AI and stream the response
	const response = await stream({
		messages: messages,
		onEnd: async (run) => {
			if (!run.outputs?.output) return;
			await prisma.message.create({
				data: {
					chatId: chatId,
					userId: userId,
					role: 'assistant',
					content: run.outputs.output
				}
			});
		}
	});

	return new StreamingTextResponse(response);
};