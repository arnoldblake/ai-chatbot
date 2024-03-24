
import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import azure_ad from "@auth/sveltekit/providers/azure-ad"
import { GITHUB_ID, GITHUB_SECRET, AZURE_AD_ID, AZURE_AD_SECRET, AZURE_AD_TENANT_ID } from "$env/static/private"

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [
        GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
        azure_ad({ clientId: AZURE_AD_ID, clientSecret: AZURE_AD_SECRET, tenantId: AZURE_AD_TENANT_ID })
    ],
})