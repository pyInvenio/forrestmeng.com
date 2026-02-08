<script>
	import { page } from '$app/stores';
	import Header from './lib/components/Header.svelte';
	import Footer from './lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO title={String($page.status)} description="Page not found." url="" />

<div class="text-black h-full w-full">
	<Header />
	<div class="min-h-screen flex flex-col items-center justify-center -mt-32">
		<h1 class="text-8xl font-bold">{$page.status}</h1>
		<p class="text-xl mt-4 mx-8 text-center">
			{#if $page.status === 404}
				density at this voxel is 0 — nothing to render here.
			{:else}
				something broke, which is unfortunate.
			{/if}
		</p>
		<a href="/" class="mt-8 px-6 py-2 border-[1px] rounded-lg hover:bg-black hover:text-white transition-all">
			back to the crossword
		</a>
	</div>
	<Footer />
</div>
