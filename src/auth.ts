import { SvelteKitAuth } from '@auth/sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '$lib/db';
import GitHub from '@auth/sveltekit/providers/github';
import azure_ad from '@auth/sveltekit/providers/azure-ad';
import {
	GITHUB_ID,
	GITHUB_SECRET,
	AZURE_AD_ID,
	AZURE_AD_SECRET,
	AZURE_AD_TENANT_ID
} from '$env/static/private';

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: DrizzleAdapter(db),
	providers: [
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
		azure_ad({ clientId: AZURE_AD_ID, clientSecret: AZURE_AD_SECRET, tenantId: AZURE_AD_TENANT_ID })
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
	if (event.url.pathname.startsWith('/chat')) {
		const session = await event.locals.auth();
		if (!session) {
			throw redirect(303, '/auth/signin');
		}
	}
	return resolve(event);
};
