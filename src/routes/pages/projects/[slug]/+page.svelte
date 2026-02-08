<script lang="ts">
	import ProjectPost from '$lib/layouts/ProjectPost.svelte';

	let { data }: { data: { content: any; meta: Record<string, any> } } = $props();
</script>

<ProjectPost {...data.meta}>
	<data.content />
</ProjectPost>
