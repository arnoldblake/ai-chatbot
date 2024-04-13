<script lang="ts">
	import Navigation from '$lib/Navigation.svelte';
	import '../app.pcss';
	import {
		AppShell,
		AppBar,
		LightSwitch,
		Drawer,
		initializeStores,
		getDrawerStore
	} from '@skeletonlabs/skeleton';
	import DensityMedium from 'virtual:icons/material-symbols/density-medium';

	// Initialize the stores
	initializeStores();
	const drawerStore = getDrawerStore();
	// Handler for the styled drawer
	function trigger(): void {
		drawerStore.open({});
	}

	export let data;
	console.log(data);

	const datePreviousWeek = new Date(new Date().setDate(new Date().getDate() - 7));
	const datePreviousMonth = new Date(new Date().setDate(new Date().getDate() - 30));
</script>

<!-- Drawer must be initialized above the AppShell component -->
<Drawer>
	<Navigation>
		<svelte:fragment slot="thisWeek">Hi</svelte:fragment>
	</Navigation>
</Drawer>
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
	<svelte:fragment slot="sidebarLeft">
		<Navigation>
			<svelte:fragment slot="thisWeek">
				<h2>This Week</h2>
				<ul class="list">
					{#each data.chats as chat (chat.id)}
						{#if chat.updatedAt >= datePreviousWeek}
							<li><span><button class="btn">{chat.name}</button></span></li>
						{/if}
					{/each}
				</ul>
			</svelte:fragment>

			<svelte:fragment slot="thisMonth">
				<h2>This Month</h2>
				<ul class="list">
					{#each data.chats as chat (chat.id)}
						{#if chat.updatedAt >= datePreviousMonth && chat.updatedAt < datePreviousWeek}
							<li><span><button class="btn">{chat.name}</button></span></li>
						{/if}
					{/each}
				</ul>
			</svelte:fragment>
			<svelte:fragment slot="everythingElse">
				<h2>Everything Else</h2>
				<ul class="list">
					{#each data.chats as chat (chat.id)}
						{#if chat.updatedAt < datePreviousMonth}
							<li><span><button class="btn">{chat.name}</button></span></li>
						{/if}
					{/each}
				</ul>
			</svelte:fragment>
		</Navigation>
	</svelte:fragment>
	<slot />
</AppShell>
