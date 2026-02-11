// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

declare module '*.md' {
	import type { SvelteComponent } from 'svelte';
	const component: typeof SvelteComponent;
	export default component;
	export const metadata: Record<string, unknown>;
}
