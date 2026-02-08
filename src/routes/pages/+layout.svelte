<script lang="ts">
	import Header from '../lib/components/Header.svelte';
	import Footer from '../lib/components/Footer.svelte';

	let { children } = $props();

	let state = 'in';
</script>

<div class=" text-black h-full w-full" style="opacity: {state === 'in' ? 1 : 0}">
	<Header />
	<div class="min-h-screen">
		{@render children()}
	</div>
	<Footer />
</div>

<style>
	/* Add your styles here as needed */
</style>
