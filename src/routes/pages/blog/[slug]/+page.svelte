<script lang="ts">
	import BlogPost from '$lib/layouts/BlogPost.svelte';
	export let data: { content: any; meta: Record<string, any> };
</script>

<BlogPost {...data.meta}>
	<svelte:component this={data.content} />
</BlogPost>
