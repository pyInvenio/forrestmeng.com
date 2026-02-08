<script lang="ts">
	import { siteConfig } from '$lib/config';

	export let title = '';
	export let description = siteConfig.description;
	export let image = siteConfig.image;
	export let url = '';
	export let type: 'website' | 'article' = 'website';
	export let publishedTime = '';
	export let tags: string[] = [];

	$: fullTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title;
	$: canonicalUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
	$: imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteConfig.title} />

	{#if type === 'article' && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	{#each tags as tag}
		<meta property="article:tag" content={tag} />
	{/each}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
