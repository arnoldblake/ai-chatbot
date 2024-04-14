<script lang="ts">
	import Chat from '$lib/Chat.svelte';
	import { useChat } from 'ai/svelte';

	$: chat = useChat({ body: { chatId: 'monkey' } });
</script>

<Chat {...chat} />
