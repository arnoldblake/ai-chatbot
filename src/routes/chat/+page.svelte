<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import { useChat } from 'ai/svelte';
	import { page } from '$app/stores';
	import aiLogo from '$lib/generated_00.png';

	const { input, handleSubmit, messages } = useChat({
		initialMessages: [
			{
				id: '0',
				role: 'assistant',
				content: "Hello, I'm a bot. How can I help you today?",
				createdAt: new Date()
			}
		]
	});
	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			handleSubmit(event);
		}
	}
</script>

<section class="card m-auto mt-8 w-2/3">
	<div class="chat h-full w-full">
		<!-- Chat -->
		<div class="grid-row-[1fr_auto] grid">
			<!-- Conversation -->
			<section class="max-h-[750px] min-h-[500px] space-y-4 overflow-y-auto p-4">
				{#each $messages as bubble}
					{#if bubble.role === 'user'}
						<div class="grid grid-cols-[auto_1fr] gap-2">
							{#if $page.data.session?.user?.image}
								<Avatar src={$page.data.session.user.image} width="w-12" />
							{/if}
							<div class="card variant-soft space-y-2 rounded-tl-none p-4">
								<header class="flex items-center justify-between">
									<p class="font-bold">{bubble.name}</p>
									<small class="opacity-50">{bubble.createdAt}</small>
								</header>
								<p>{bubble.content}</p>
							</div>
						</div>
					{:else}
						<div class="grid grid-cols-[1fr_auto] gap-2">
							<div class="card variant-soft-primary space-y-2 rounded-tr-none p-4">
								<header class="flex items-center justify-between">
									<p class="font-bold">{bubble.name}</p>
									<small class="opacity-50">{bubble.createdAt}</small>
								</header>
								<p>{bubble.content}</p>
							</div>
							<Avatar src={aiLogo} width="w-12" />
						</div>
					{/if}
				{/each}
			</section>
			<!-- Prompt -->
			<section class="border-t border-surface-500/30 p-4">
				<div
					class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
				>
					<button class="input-group-shim">+</button>
					<textarea
						bind:value={$input}
						class="border-0 bg-transparent ring-0"
						name="prompt"
						id="prompt"
						placeholder="Write a message..."
						rows="1"
						on:keydown={onPromptKeydown}
					/>
					<button
						class={$input ? 'variant-filled-primary' : 'input-group-shim'}
						on:click={handleSubmit}
					>
						<i class="fa-solid fa-paper-plane" />
					</button>
				</div>
			</section>
		</div>
	</div>
</section>
