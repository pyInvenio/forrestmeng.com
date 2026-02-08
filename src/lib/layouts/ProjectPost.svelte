<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { siteConfig } from '$lib/config';
	import Icon from '@iconify/svelte';

	export let title = '';
	export let subtitle = '';
	export let slug = '';
	export let description = '';
	export let image = '';
	export let links: { label: string; url: string }[] = [];

	$: projectSchema = {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: title,
		description: description || subtitle,
		author: { '@type': 'Person', name: siteConfig.author }
	};
</script>

<svelte:head>
	<script async src="https://platform.twitter.com/widgets.js"></script>
</svelte:head>

<SEO
	{title}
	description={description || subtitle}
	image={image || siteConfig.image}
	url="/pages/projects/{slug}"
/>
<JsonLd schema={projectSchema} />

<div class="relative mx-auto flex lg:w-[50%] w-[95%] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">{title}</h1>
			{#if subtitle}
				<h3 class="text-xl italic">{subtitle}</h3>
			{/if}
			{#if links.length > 0}
				<div class="flex flex-col gap-1 mt-1">
					{#each links as link}
						<h3>
							<a
								href={link.url}
								target="_blank"
								class="flex flex-row align-baseline text-center"
							>
								{link.label}<Icon icon="carbon:arrow-up-right" />
							</a>
						</h3>
					{/each}
				</div>
			{/if}
			<div class="prose max-w-none my-4">
				<slot />
			</div>
		</div>
	</div>
</div>
