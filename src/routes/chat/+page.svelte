<script lang="ts">
	// Svelte Stuff
	import { useChat } from 'ai/svelte';
	import { applyAction, enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	// AI Avatar Image
	import AIAvatar from '$lib/generated_00.png';
	// UI Components
	import { Accordion, AccordionItem, RangeSlider, Avatar } from '@skeletonlabs/skeleton';
	// Types
	import type { ActionData, PageData } from './$types';
	// Icons
	import MdiVectorPolylinePlus from '~icons/mdi/vector-polyline-plus';
	import FormkitSubmit from '~icons/formkit/submit';
	import MdiTrash from '~icons/mdi/trash';
	import MdiPlus from '~icons/mdi/plus';
	import MdiEdit from '~icons/mdi/edit';
	import MdiEye from '~icons/mdi/eye';

	export let data: PageData;

	// Chat Settings TODO: Hook these into the langchain model
	let temperature = 9;
	let memory = 5;

	const { input, handleSubmit, messages, append } = useChat({
		initialMessages: [],
		sendExtraMessageFields: true,
		body: {
			user: {
				id: $page.data.session?.user?.id,
				thread: crypto.randomUUID()
			}
		}
	});

	function handleEdit(event: Event) {
		event.preventDefault();
		const form = event.target.closest('form');
		const input = form.querySelector('input[type="text"]');
		input.disabled = !input.disabled;
		if (input.disabled) {
		} else {
			input.focus();
		}
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			handleSubmit(event);
		}
	}

	onMount(() => {
		// Append a message to the chat
		append({
			id: crypto.randomUUID().substring(0, 7),
			role: 'assistant',
			content: "Hello, I'm a bot. How can I help you today?",
			createdAt: new Date()
		});
	});
</script>

<div class="m-6 grid grid-cols-[auto_1fr] gap-2">
	<div class="min-w-[425px]">
		<Accordion autocollapse>
			<!-- Chat Model Settings -->
			<AccordionItem>
				<svelte:fragment slot="summary">Settings</svelte:fragment>
				<svelte:fragment slot="content">
					<RangeSlider name="range-slider" bind:value={temperature} max={10} step={1} ticked
						>Temperature
					</RangeSlider>

					<RangeSlider name="range-slider" bind:memory max={10} step={2} ticked>
						<span>Memory</span>
						<div class="flex items-center justify-between">
							<div class="text-sm">Short</div>
							<div class="text-sm">Long</div>
						</div>
					</RangeSlider>
				</svelte:fragment>
			</AccordionItem>
			<!-- Document Upload -->
			<AccordionItem>
				<svelte:fragment slot="summary">File Upload</svelte:fragment>
				<svelte:fragment slot="content">
					<form method="POST" use:enhance enctype="multipart/form-data" action="/document?/create">
						<label for="file">Upload a document:</label>
						<input accept=".txt" id="file" name="file" type="file" />
						<button class="variant-soft-tertiary btn" type="submit" title="Submit">
							<FormkitSubmit />
						</button>
					</form>
					<ul class="list">
						{#each data.files as file (file.id)}
							<li>
								<span>
									{file.filename}
									{file.size}
									<form action="/document?/delete" method="POST" use:enhance class="inline">
										<button
											class="variant-soft-tertiary btn-icon"
											title="Vectorize"
											formaction="/document?/vectorize"
										>
											<MdiVectorPolylinePlus />
										</button>
										<button class="variant-soft-tertiary btn-icon" title="Delete">
											<MdiTrash />
										</button>
										<input type="hidden" name="id" value={file.id} />
										<input type="hidden" name="filename" value={file.filename} />
									</form>
								</span>
							</li>
						{/each}
					</ul>
				</svelte:fragment>
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="summary">Threads</svelte:fragment>
				<svelte:fragment slot="content">
					<ul class="list">
						{#each data.threads as thread (thread.id)}
							<li>
								<form
									class="w-full"
									action="/thread?/update"
									method="POST"
									use:enhance={() => {
										return async (result) => {
											await applyAction(result);
										};
									}}
								>
									<div class="input-group input-group-divider grid-cols-[1fr_auto_auto] gap-1">
										<input type="hidden" name="id" value={thread.id} />
										<input type="text" name="name" value={thread.name} />
										<button
											formaction="/chat?/load"
											class="variant-soft-tertiary btn-sm"
											title="Edit"
										>
											<MdiEye />
										</button>
										<button
											formaction="/thread?/delete"
											class="variant-soft-tertiary btn-sm"
											title="Delete"
										>
											<MdiTrash />
										</button>
									</div>
								</form>
							</li>
						{/each}
						<li>
							<form action="/thread?/create" method="POST" use:enhance>
								<button class="variant-soft-tertiary btn"><MdiPlus /></button>
							</form>
						</li>
					</ul>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>
	<!-- Start of the Chat -->
	<section class="card">
		<div class="chat h-full w-full">
			<!-- Chat -->
			<div class="grid-row-[1fr_auto] grid">
				<!-- Conversation -->
				<section class="max-h-[750px] min-h-[500px] space-y-4 overflow-y-auto p-4">
					{#each $messages as bubble (bubble.id)}
						{#if bubble.role === 'user'}
							<div class="grid grid-cols-[auto_1fr] gap-2">
								{#if $page.data.session?.user?.image}
									<Avatar src={$page.data.session.user.image} width="w-12" />
								{/if}
								<div class="card variant-soft space-y-2 rounded-tl-none p-4">
									<header class="flex items-center justify-between">
										<p class="font-bold">{$page.data.session?.user?.name}</p>
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
</div>
