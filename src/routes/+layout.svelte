<script lang="ts">
	import '../app.pcss';
	import {
		AppShell,
		AppBar,
		LightSwitch,
		Drawer,
		initializeStores,
		getDrawerStore,
		type DrawerSettings
	} from '@skeletonlabs/skeleton';
	import DensityMedium from 'virtual:icons/material-symbols/density-medium';

	// Initialize the stores
	initializeStores();

	const drawerStore = getDrawerStore();
	// Handler for the styled drawer
	function triggerStyled(): void {
		const drawerSettings: DrawerSettings = {
			id: 'demo',
			// Property Overrides
			position: 'right',
			bgDrawer: 'bg-tertiary-900 text-white',
			bgBackdrop: 'bg-gradient-to-tr variant-gradient-primary-secondary',
			width: 'w-[280px] md:w-[480px]',
			padding: 'p-4',
			rounded: 'rounded-xl',
			// Metadata
			meta: 'Styled Drawer'
		};
		drawerStore.open(drawerSettings);
	}
</script>

<!-- Drawer must be initialized above the AppShell component -->
<Drawer />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-2" slotTrail="place-content-end"
			>Skeleton
			<svelte:fragment slot="trail">
				<LightSwitch />
				<button on:click={triggerStyled}><DensityMedium /></button>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
