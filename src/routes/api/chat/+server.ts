import type { RequestHandler } from './$types';
import { invoke, stream } from '$lib/helpfull_ai';

export const POST: RequestHandler = async (event) => {
    const body = await event.request.formData();
    return new Response(JSON.stringify({ message: await invoke(await body.get('message') as string) }), {
        headers: { 'Content-Type': 'application/json' }
    });
};