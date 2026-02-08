<script lang="ts">
	import BlogPost from '$lib/layouts/BlogPost.svelte';

	let { data }: { data: { content: any; meta: Record<string, any> } } = $props();
</script>

<BlogPost {...data.meta}>
	<data.content />
</BlogPost>
