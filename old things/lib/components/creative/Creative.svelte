<script lang="ts">
	import { activeLargeComponent, activeSmallComponent, largeComponentActive } from '../../stores';

    const illus = [
        {
            name: 'Selected Personal Works',
            style: 'text-red-500',
            component: null
        },
        {
            name: 'Studies',
            style: 'text-red-500',
            component: null
        },
        {
            name: 'Mural',
            style: 'text-red-500',
            component: null
        },
    ]

    const photos = [
        {
            name: 'Selected Candid Photography',
            style: 'text-red-500',
            component: null
        },
        {
            name: 'Portraits',
            style: 'text-red-500',
            component: null
        },
    ]

	const setActiveLarge = (component: any) => {
		if (activeLargeComponent) {
			activeLargeComponent.set(null);
            largeComponentActive.set(false);
		}
		if (window.innerWidth < 1000) {
			console.log('mobile view');
			if (activeSmallComponent) {
				activeSmallComponent.set(null);
			}
		}
        largeComponentActive.set(true);
		activeLargeComponent.set(component);
	};
</script>

<div class="w-full h-full text-lg">
	<h1 class="text-xl">Illustrations (Coming Soon)</h1>
	<!-- button -->
	<div class="mt-2 flex-col flex">
		{#each illus as illustration}
			<button
				class="text-bold text-start hover:underline {illustration.style}"
				on:click={() => setActiveLarge(illustration.component)}
			>
				<h1>> {illustration.name}</h1>
			</button>
		{/each}
	</div>
    <br>
    <h1 class="text-xl">Photography (Coming Soon)</h1>
	<!-- button -->
	<div class="mt-2 flex-col flex">
		{#each photos as photo}
			<button
				class="text-bold text-start hover:underline {photo.style}"
				on:click={() => setActiveLarge(photo.component)}
			>
				<h1>> {photo.name}</h1>
			</button>
		{/each}
	</div>
</div>
