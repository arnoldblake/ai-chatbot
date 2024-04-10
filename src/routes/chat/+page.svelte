<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import Chat from '$lib/Chat.svelte';
	import { Accordion, AccordionItem, RangeSlider } from '@skeletonlabs/skeleton';
	// Icons
	import MdiVectorPolylinePlus from '~icons/mdi/vector-polyline-plus';
	import FormkitSubmit from '~icons/formkit/submit';
	import MdiTrash from '~icons/mdi/trash';
	import MdiPlus from '~icons/mdi/plus';
	import MdiEdit from '~icons/mdi/edit';
	import { useChat } from 'ai/svelte';

	// Chat Settings TODO: Hook these into the langchain model
	let temperature = 9;
	let memory = 5;

	$: chat = useChat({
		initialMessages: $page.data.messages,
		sendExtraMessageFields: true,
		id: $page.data.threads[0].id,
		body: {
			thread: $page.data.threads[0].id
		}
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
						<label for="file">Select a document:</label>
						<div class="input-group input-group-divider grid-cols-[1fr_auto] gap-1">
							<input accept=".txt" id="file" name="file" type="file" class="input" />
							<button class="variant-soft-tertiary btn btn-sm" type="submit" title="Submit">
								<FormkitSubmit />
							</button>
						</div>
					</form>
					<ul class="list">
						{#each $page.data.files as file (file.id)}
							<li>
								<form method="POST" use:enhance class="inline w-full">
									<div class="input-group input-group-divider grid-cols-[1fr_auto_auto] gap-1">
										<span class="pl-2">{file.filename}</span>
										<button
											class="variant-soft-tertiary btn-sm"
											title="Vectorize"
											formaction="/document?/vectorize"
										>
											<MdiVectorPolylinePlus />
										</button>
										<button
											formaction="/document?/delete"
											class="variant-soft-tertiary btn-sm"
											title="Delete"
										>
											<MdiTrash />
										</button>
										<input type="hidden" name="id" value={file.id} />
										<input type="hidden" name="filename" value={file.filename} />
									</div>
								</form>
							</li>
						{/each}
					</ul>
				</svelte:fragment>
			</AccordionItem>
			<!-- Chats -->
			<AccordionItem open>
				<svelte:fragment slot="summary">Chats</svelte:fragment>
				<svelte:fragment slot="content">
					<ul class="list">
						{#each $page.data.threads as thread (thread.id)}
							<li>
								<form
									class="w-full"
									action="/chat?/update"
									method="POST"
									use:enhance={({ formElement, submitter, cancel }) => {
										if (submitter.name == 'edit') {
											const input = formElement.querySelector('input[name="name"]');
											if (input?.type == 'text') {
												input.type = 'submit';
											} else {
												input.type = 'text';
												cancel();
											}
										}
									}}
								>
									<div class="input-group input-group-divider grid-cols-[1fr_auto_auto] gap-1">
										<input type="hidden" name="id" value={thread.id} />
										<input formaction="/chat?/read" type="submit" name="name" value={thread.name} />
										<button class="variant-soft-tertiary btn-sm" title="Edit" name="edit">
											<MdiEdit />
										</button>
										<button
											formaction="/chat?/delete"
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
							<form action="/chat?/create" method="POST" use:enhance>
								<button class="variant-soft-tertiary btn"><MdiPlus /></button>
							</form>
						</li>
					</ul>
				</svelte:fragment>
			</AccordionItem>
		</Accordion>
	</div>
	<!-- Start of the Chat -->
	<Chat {...chat} />
</div>
