<script lang="ts">
	import ProjectPost from '$lib/layouts/ProjectPost.svelte';

	export let data: { content: any; meta: Record<string, any> };
</script>

<ProjectPost {...data.meta}>
	<svelte:component this={data.content} />
</ProjectPost>
