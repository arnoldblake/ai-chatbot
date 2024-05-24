import { SvelteKitAuth } from '@auth/sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

import GitHub from '@auth/sveltekit/providers/github';
import Entra from '@auth/sveltekit/providers/microsoft-entra-id';
import {
	GITHUB_ID,
	GITHUB_SECRET,
	AZURE_AD_ID,
	AZURE_AD_SECRET,
	AZURE_AD_TENANT_ID
} from '$env/static/private';

const prisma = new PrismaClient();

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
		Entra({ clientId: AZURE_AD_ID, clientSecret: AZURE_AD_SECRET, tenantId: AZURE_AD_TENANT_ID })
	],
	callbacks: {
		async session({ session }) {
			return {
				expires: session.expires,
				user: {
					id: session.user.id,
					name: session.user.name,
					image: session.user.image,
					email: session.user.email
				}
			};
		}
	}
});

export const authorizationHandle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	if (pathname.startsWith('/chat') || pathname.startsWith('/api')) {
		const session = await event.locals.auth();
		if (!session) {
			throw redirect(303, '/auth/signin');
		}
	}
	return resolve(event);
};
