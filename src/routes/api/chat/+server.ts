import type { RequestHandler } from './$types';
import { StreamingTextResponse } from 'ai';
import { stream } from '$lib/helpfull_ai';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	// If there is only one message and it is from the assistant, return 200
	// This is done because the first message uses append inside of onMount
	if (body.messages.length === 1 && body.messages[0].role === 'assistant') return new Response();

	// Prompt the AI and stream the response
	const response = await stream(body.messages.pop().content, JSON.stringify(body.messages));
	return new StreamingTextResponse(response);
};
