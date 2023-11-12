<script lang="ts">
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import Header from '../lib/components/Header.svelte';
	import Footer from '../lib/components/Footer.svelte';
	inject({ mode: dev ? 'development' : 'production' });

	let state = 'in'; // Add this state variable
</script>

<div class=" text-black h-full w-full" style="opacity: {state === 'in' ? 1 : 0}">
	<Header />
	<div class="min-h-screen">
		<slot />
	</div>
	<Footer />
</div>

<style>
	/* Add your styles here as needed */
</style>
