<script lang="ts">
	import Latis from './Latis.svelte';
	import HapticTactics from './HapticTactics.svelte';
	import Collab from './COLLAB.svelte';
	import Arl from './ARL.svelte';
	import Covila from './Covila.svelte';
	import SpO2 from './SpO2.svelte';
	import HapticGlove from './HapticGlove.svelte';
	import BadApple from './BadApple.svelte';
	import { activeLargeComponent, activeSmallComponent } from '../../stores';

	const projects = [
		{
			name: 'Latis: Securing Industrial IoT OTA updates through decentralization',
			component: Latis,
			style: 'text-violet-300'
		},
		{
			name: 'Haptic Tactics: Haptic feedback VR proxy for drilling applications',
			component: HapticTactics,
			style: 'text-blue-300'
		},
		{
			name: 'CoViLa: Computer vision powered ball launcher',
			component: Covila,
			style: 'text-green-300'
		},
		{
			name: 'SpO2 Calculator: Circuit design and Arduino code for SpO2 sensor',
			component: SpO2,
			style: 'text-teal-300'
		}
	];

	const research = [
		{
			name: 'Collaborative Robotics Lab: Learning Dynamics',
			component: Collab,
			style: 'text-blue-300'
		},
		{
			name: 'Assistive Robotics Lab: Lower body exoskeleton',
			component: Arl,
			style: 'text-violet-300'
		}
	];

	const funBuilds = [
		{
			name: 'Haptic Glove',
			component: HapticGlove,
			style: 'text-blue-300'
		},
		{
			name: 'Playing Bad Apple on Everything',
			component: BadApple,
			style: 'text-blue-300'
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
	<br />
	<h1 class="text-2xl">UG Research</h1>
	<div class="mt-2 flex-col flex">
		{#each research as res}
			<button
				class="text-bold text-start hover:underline {res.style}"
				on:click={() => setActiveLarge(res.component)}
			>
				<h1>> {res.name}</h1>
			</button>
		{/each}
	</div>
	<br />
	<h1 class="text-2xl">Fun Builds</h1>
	<div class="mt-2 flex-col flex">
		{#each funBuilds as fun}
			<button
				class="text-bold text-start hover:underline {fun.style}"
				on:click={() => setActiveLarge(fun.component)}
			>
				<h1>> {fun.name}</h1>
			</button>
		{/each}
	</div>
</div>
