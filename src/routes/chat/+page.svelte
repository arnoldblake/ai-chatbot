<script lang="ts">
	import Chat from '$lib/Chat.svelte';
	import { useChat, type Message } from 'ai/svelte';
	import type { ActionData } from './$types';
	import type { PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: chat = useChat({
		initialMessages: (form?.messages as Message[]) || (data.messages as Message[]),
		body: { chatId: form?.chat?.id || data.chat.id }
	});
</script>

<Chat {...chat} />
