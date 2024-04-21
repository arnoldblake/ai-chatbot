<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar } from '@skeletonlabs/skeleton';
	// AI Avatar Image
	import AIAvatar from '$lib/generated_00.png';
	import type { ChatRequestOptions } from 'ai';

	import MdiPaperAirplane from '~icons/mdi/paper-airplane';
	import MdiPaperclip from '~icons/mdi/paperclip';

	export let input;
	export let messages;
	export let handleSubmit: (e: any, chatRequestOptions?: ChatRequestOptions) => void;

	const userImage = $page?.data?.session?.user?.image || undefined;
	const userName = $page?.data?.session?.user?.name || undefined;

	// Collect the rest of the properties passed
	const restP = $$restProps;

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			handleSubmit(event);
		}
	}
</script>

<section class="card m-4">
	<div class="chat h-full w-full">
		<!-- Chat -->
		<div class="grid-row-[1fr_auto] grid">
			<!-- Conversation -->
			<section class="max-h-[750px] min-h-[500px] space-y-4 overflow-y-auto p-4">
				{#each $messages as bubble (bubble.id)}
					{#if bubble.role === 'user'}
						<div class="grid grid-cols-[auto_1fr] gap-2">
							<Avatar src={userImage} width="w-12" />
							<div class="card variant-soft space-y-2 rounded-tl-none p-4">
								<header class="flex items-center justify-between">
									<p class="font-bold">{userName}</p>
									<small class="opacity-50">{bubble.createdAt}</small>
								</header>
								<p>{bubble.content}</p>
							</div>
						</div>
					{:else}
						<div class="grid grid-cols-[1fr_auto] gap-2">
							<div class="card variant-soft-primary space-y-2 rounded-tr-none p-4">
								<header class="flex items-center justify-between">
									<p class="font-bold">{bubble.role}</p>
									<small class="opacity-50">{bubble.createdAt}</small>
								</header>
								<p>{bubble.content}</p>
							</div>
							<Avatar src={AIAvatar} width="w-12" />
						</div>
					{/if}
				{/each}
			</section>
			<!-- Prompt -->
			<section class="border-t border-surface-500/30 p-4">
				<div
					class="input-group input-group-divider w-64 grid-cols-[auto_1fr_auto] rounded-container-token lg:w-full"
				>
					<button class="input-group-shim"><MdiPaperclip /></button>
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
						<MdiPaperAirplane />
					</button>
				</div>
			</section>
		</div>
	</div>
</section>
