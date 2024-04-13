import type { PageServerLoad } from './$types';
import { prisma } from '$lib/db';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	const userId = session?.user?.id || '';
	const chat = await prisma.chat.create({
		data: {
			userId: userId
		}
	});
	return { chatId: chat.id }
};
