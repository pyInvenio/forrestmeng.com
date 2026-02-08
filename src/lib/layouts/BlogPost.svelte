<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import { siteConfig } from '$lib/config';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		date?: string;
		description?: string;
		tags?: string[];
		image?: string;
		subtitle?: string;
		slug?: string;
		children: Snippet;
	}

	let {
		title = '',
		date = '',
		description = '',
		tags = [],
		image = '',
		subtitle = '',
		slug = '',
		children
	}: Props = $props();

	const articleSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		description,
		datePublished: date ? new Date(date).toISOString() : '',
		author: { '@type': 'Person', name: siteConfig.author },
		publisher: { '@type': 'Person', name: siteConfig.author },
		keywords: tags.join(', ')
	});
</script>

<SEO
	{title}
	{description}
	image={image || siteConfig.image}
	url="/pages/blog/{slug}"
	type="article"
	publishedTime={date ? new Date(date).toISOString() : ''}
	{tags}
/>
<JsonLd schema={articleSchema} />
<ScrollProgress />

<div class="relative mx-auto flex lg:w-[50%] w-[95%] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">{title}</h1>
			{#if subtitle}
				<h3 class="text-xl italic">{subtitle}</h3>
			{/if}
			<div class="prose max-w-none my-4">
				{@render children()}
			</div>
		</div>
	</div>
</div>
