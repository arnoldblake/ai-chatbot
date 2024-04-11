<script>
	import '../app.pcss';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
</script>


<AppShell>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-2" slotTrail="place-content-end">Skeleton
			<svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<!-- ... -->
</AppShell>
