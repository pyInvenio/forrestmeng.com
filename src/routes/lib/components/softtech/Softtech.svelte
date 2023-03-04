<script lang="ts">
	import { activeLargeComponent, activeSmallComponent } from '../../stores';

	import Artscaper from './Artscaper.svelte';
	import Smartdollars from './Smartdollars.svelte';
	import Spacesight from './Spacesight.svelte';
	import Taldera from './TALDERA.svelte';
	import CoinDetection from './CoinDetection.svelte';
	import CubeRotation from './CubeRotation.svelte';
	import QuizzAr from './QuizzAR.svelte';
	const projects = [
		{
			name: 'Artscaper: Web-based AI powered image reference search and curation engine for artists',
			component: Artscaper,
			style: 'text-violet-300'
		},
		{
			name: 'SmartDollars AI: GPT powered financial literacy aid',
			component: Smartdollars,
			style: 'text-blue-300'
		},
		{
			name: 'SpaceSight: Visualize how a satellite would look like from another satellite (SCOUT Inc. Intern Project)',
			component: Spacesight,
			style: 'text-green-300'
		},
		{
			name: 'TALDERA: NLP for summarizing Discord chat logs (1st place @ CohereAI Thanksgiving Hackathon)',
			component: Taldera,
			style: 'text-teal-300'
		},
		{
			name: 'Coin Detection: Coding Edge Detection and Hough Transform from Scratch',
			component: QuizzAr,
			style: 'text-sky-300'
		},
		{
			name: 'QuizzAR: Fun financial literacy through interactive Unity quizzes (1st place Education Track @ HackDuke)',
			component: Taldera,
			style: 'text-purple-300'
		},
		{
			name: 'Cube Rotation: Superimposing a perspective cube on a chessboard in video',
			component: CubeRotation,
			style: 'text-fuchsia-300'
		}
	];

	const setActiveLarge = (component: any) => {
		if (activeLargeComponent) {
			activeLargeComponent.set(null);
		}
		if (window.innerWidth < 768) {
			console.log('mobile view');
			if (activeSmallComponent) {
				activeSmallComponent.set(null);
			}
		}
		activeLargeComponent.set(component);
	};
</script>

<div class="w-full h-full text-lg">
	<h1 class="text-xl">Projects</h1>
	<!-- button -->
	<div class="mt-2 flex-col flex">
		{#each projects as project}
			<button
				class="text-bold text-start hover:underline {project.style}"
				on:click={() => setActiveLarge(project.component)}
			>
				<h1>> {project.name}</h1>
			</button>
		{/each}
	</div>
</div>
