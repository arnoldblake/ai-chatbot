<script lang="ts">
	import '../../app.pcss';
	import {
		AppShell,
		AppBar,
		LightSwitch,
		initializeStores,
		getDrawerStore
	} from '@skeletonlabs/skeleton';
	import DensityMedium from '~icons/material-symbols/density-medium';

	// Initialize the stores
	initializeStores();
	const drawerStore = getDrawerStore();
	// Handler for the styled drawer
	function trigger(): void {
		drawerStore.open({});
	}
</script>

<AppShell slotSidebarLeft="bg-surface-700 w-0 lg:w-64">
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="btn btn-sm mr-4 lg:hidden" on:click={trigger}>
						<DensityMedium />
					</button>
					<strong class="text-xl uppercase">AI Chat</strong>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
