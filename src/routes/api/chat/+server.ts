import type { RequestHandler } from './$types';
import { StreamingTextResponse } from 'ai';
import { stream } from '$lib/helpfull_ai';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const response = await stream(body.messages.pop().content, JSON.stringify(body.messages));
	return new StreamingTextResponse(response);
};
