import type { RequestHandler } from './$types';
import { StreamingTextResponse } from 'ai';
import { stream } from '$lib/helpfull_ai';
import { prisma } from '$lib/db';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth();
	const { messages, thread } = await request.json();

	// Get the most recent message, assuming its the last one
	const message = messages[messages.length - 1];

	// Save the message to the database
	await prisma.message.create({
		data: {
			role: message.role,
			content: message.content,
			threadId: thread,
			userId: session?.user?.id || ''
		}
	});

	// Prompt the AI and stream the response
	const response = await stream(
		messages.pop().content,
		JSON.stringify(messages),
		thread,
		session?.user?.id || ''
	);
	return new StreamingTextResponse(response);
};