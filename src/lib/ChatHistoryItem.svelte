<script lang="ts">
	import MdiEdit from '~icons/mdi/edit';
	import MdiTrash from '~icons/mdi/trash';
</script>

<li>
	<span
		class="input-group input-group-divider w-64 grid-cols-[1fr_auto_auto] rounded-container-token lg:w-full"
	>
		<button class="btn">
			<slot name="item">Sample</slot>
		</button>
		<button class="btn btn-sm">
			<MdiEdit />
		</button>
		<button class="btn btn-sm">
			<MdiTrash />
		</button>
	</span>
</li>
