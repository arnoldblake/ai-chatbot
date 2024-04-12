<script lang="ts">
	import { page } from '$app/stores';
	import Chat from '$lib/Chat.svelte';
	import { useChat } from 'ai/svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: chat = useChat({
		initialMessages: data.messages,
		sendExtraMessageFields: true,
		body: {
			chatId: $page.params.id
		}
	});
</script>

<!-- Start of the Chat -->
<Chat {...chat} />
