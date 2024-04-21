<script lang="ts">
	import MdiEdit from '~icons/mdi/edit';
	import MdiTrash from '~icons/mdi/trash';
	import { enhance } from '$app/forms';

	export let id: string;
	export let name: string;

	// Collect the rest of the properties passed
	const restP = $$restProps;

	function handleFormSubmit({
		formElement,
		submitter,
		cancel
	}: {
		submitter: HTMLButtonElement | HTMLInputElement;
	}) {
		if (submitter.name == 'edit') {
			const input = formElement.querySelector('input[name="chatName"]');
			if (input?.type == 'text') {
				input.type = 'submit';
			} else {
				input.type = 'text';
				cancel();
			}
		}
	}
</script>

<li>
	<form
		use:enhance={handleFormSubmit}
		method="POST"
		action="?/read"
		class="input-group input-group-divider w-64 grid-cols-[1fr_auto_auto] rounded-container-token lg:w-full"
	>
		<input type="hidden" name="chatId" value={id} />
		<input type="submit" name="chatName" value={name} />
		<button class="btn btn-sm" name="edit">
			<MdiEdit />
		</button>
		<button class="btn btn-sm" formaction="?/delete">
			<MdiTrash />
		</button>
	</form>
</li>
