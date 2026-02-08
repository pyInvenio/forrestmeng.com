<script lang="ts">
	export let schema: Record<string, unknown>;
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>
