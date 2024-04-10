import type { RequestHandler } from './$types';
import { StreamingTextResponse } from 'ai';
import { stream } from '$lib/helpfull_ai';
import { prisma } from '$lib/db';
import { fail } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth();
	const { messages, thread } = await request.json();
	if (!session?.user?.id) {
		return fail(401, {
			error: true,
			message: 'You must be logged in.'
		});
	}

	// Get the most recent message, assuming its the last one
	const message = messages[messages.length - 1];

	// Save the message to the database
	await prisma.message.create({
		data: {
			role: message.role,
			content: message.content,
			userId: session.user.id,
			threadId: thread
		}
	});

	// Prompt the AI and stream the response
	const response = await stream(
		messages.pop().content,
		JSON.stringify(messages),
		thread,
		session.user.id
	);
	return new StreamingTextResponse(response);
};
