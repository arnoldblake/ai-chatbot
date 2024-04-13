<script lang="ts">
	import Chat from '$lib/Chat.svelte';
	import { useChat } from 'ai/svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data);

	$: chat = useChat({
		body: {
			chatId: data.chatId
		}
	});
</script>

<Chat {...chat} />
