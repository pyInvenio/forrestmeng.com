<script lang="ts">
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
	import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries.js';
	import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';

	import AboutMe from './lib/components/about/AboutMe.svelte';
	import HardTech from './lib/components/hardtech/HardTech.svelte';
	import Softtech from './lib/components/softtech/Softtech.svelte';
	import Creative from './lib/components/creative/Creative.svelte';

	import { activeLargeComponent, activeSmallComponent, largeComponentActive } from './lib/stores';

	let mobius: HTMLDivElement;

	let nameBtn: HTMLButtonElement;

	let selectedCategory: string;
	let aboutSelected = false;
	const categories = [
		{ name: 'Hard tech', component: HardTech },
		{ name: 'Soft tech', component: Softtech },
		{ name: 'Creative Work', component: Creative }
	];

	let largeDiv: HTMLDivElement;
	let smallDiv: HTMLDivElement;

	const setActiveLargeComponent = (component: any) => {
		activeLargeComponent.set(null);
		if (component == null) {
			aboutSelected = false;
			activeLargeComponent.set(null);
			largeComponentActive.set(false);
			return;
		}

		// if in mobile view, set the active small component to null

		if (window.innerWidth < 1000) {
			console.log('mobile view');
			if (activeSmallComponent) {
				activeSmallComponent.set(null);
			}
		}

		activeLargeComponent.set(component);
		largeComponentActive.set(true);
	};

	const setActiveSmallComponent = (component: any) => {
		if (component == null) {
			activeSmallComponent.set(null);
			selectedCategory = '';
			return;
		}
		if (activeSmallComponent) {
			activeSmallComponent.set(null);
		}
		activeSmallComponent.set(component);
	};

	onMount(() => {
		const onWindowResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			effect.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			if (window.innerWidth < 768) {
				camera.position.z = 10;
				camera.position.x = -1;
			} else {
				camera.position.z = 5;
				camera.position.x = -2;
			}
			if (window.innerWidth < 1000) {
				let $largeActive = false;
				largeComponentActive.subscribe((value) => {
					$largeActive = value;
				});
				console.log('mobile view');
				if ($largeActive) {
					activeSmallComponent.set(null);
					selectedCategory = '';
				}
			}
		};
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			30,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		const effect = new AsciiEffect(renderer, ' .,:;i1tfLCG08@', { invert: true });
		effect.setSize(window.innerWidth, window.innerHeight);
		effect.domElement.style.color = '#5040AE';
		effect.domElement.style.backgroundColor = 'transparent';
		effect.domElement.style.fontSize = '1px';
		mobius.appendChild(effect.domElement);

		const pointLight = new THREE.PointLight(0xffffff, 2, 100);
		pointLight.position.set(5, 5, 8);
		scene.add(pointLight);

		// create a custom Möbius strip geometry
		const geometry = new ParametricGeometry(ParametricGeometries.mobius3d, 20, 100).scale(
			1,
			1,
			0.4
		);

		// create a material for the Möbius strip
		const material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			specular: 0xaaaaaa,
			shininess: 10,
			flatShading: true
		});

		if (window.innerWidth < 768) {
			camera.position.z = 10;
			camera.position.x = -1;
		} else {
			camera.position.z = 5;
			camera.position.x = -2;
		}

		// create a mesh from the Möbius strip geometry and material
		const mobiusStrip = new THREE.Mesh(geometry, material);
		// rotate the mesh so that the strip is visible
		mobiusStrip.rotation.x = Math.PI / 2 + 0.1;
		// tilt the mesh so that the strip is visible
		mobiusStrip.rotation.y = 0.4;

		// add the mesh to the scene
		scene.add(mobiusStrip);

		mobiusStrip.rotation.z = Math.PI / 1;

		const animate = () => {
			requestAnimationFrame(animate);
			effect.render(scene, camera);
			mobiusStrip.rotation.z -= 0.001;
		};
		animate();
		window.addEventListener('resize', onWindowResize, false);
	});
</script>

<div bind:this={mobius} class="absolute mx-auto my-auto overflow-hidden top-0 -z-10" />

<div class="w-screen px-4 lg:px-0 lg:max-w-[80%] mx-auto py-10 h-screen overflow-x-hidden">
	<div class="lg:grid-cols-2 lg:grid flex-col flex lg:gap-16 h-full">
		<div class="col-span-1 col-start-1">
			<div class="space-y-4 mt-[15%]">
				<button
					bind:this={nameBtn}
					on:click={() => {
						setActiveSmallComponent(null);
						if (aboutSelected) {
							aboutSelected = false;
							setActiveLargeComponent(null);
							return;
						}
						aboutSelected = true;
						setActiveLargeComponent(AboutMe);
					}}
				>
					<h1
						class="text-5xl font-medium transition-all ease-in-out hover:text-white {aboutSelected
							? 'text-white'
							: 'text-gray-300'}"
					>
						Forrest Meng
					</h1>
				</button>
				<div class="pt-4">
					<ul
						class="flex flex-wrap text-center dark:text-gray-400 gap-x-12 text-2xl lg:text-4xl font-extralight"
					>
						{#each categories as category}
							<li class="hover:text-white transition-all ease-in-out">
								<button
									class:selected={selectedCategory === category.name}
									on:click={() => {
										setActiveLargeComponent(null);
										// if it is already selected, then deselect it
										if (selectedCategory === category.name) {
											setActiveSmallComponent(null);
											selectedCategory = '';
											return;
										}
										setActiveSmallComponent(category.component);
										selectedCategory = category.name;
									}}
								>
									{category.name}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>
			{#if $activeSmallComponent}
				<div
					class="w-full  bg-black bg-opacity-20 border-[1px] border-primary rounded-3xl h-[30rem] mt-8 backdrop-blur-sm"
					bind:this={smallDiv}
				>
					<div class="h-full w-full p-8 ">
						<div class="overflow-auto flex h-full w-full">
							<svelte:component this={$activeSmallComponent} />
						</div>
					</div>
				</div>
			{/if}
		</div>
		{#if $activeLargeComponent}
			<div
				class="col-span-1 col-start-2 h-[55%] lg:min-h-full mt-8 lg:mt-0 backdrop-blur-sm"
				bind:this={largeDiv}
			>
				<div
					class="w-full bg-black bg-opacity-20 border-[1px] border-primary rounded-3xl h-full my-auto"
				>
					<div class="h-full w-full p-8 my-auto">
						<div class="overflow-auto flex h-full w-full">
							<svelte:component this={$activeLargeComponent} />
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
<div class="absolute bottom-0 md:bottom-10 left-[5%] lg:left-[10%] space-x-4">
	<div class="flex space-x-4 text-gray-300 transition-all ease-in-out">
		<a href="https://github.com/pyInvenio" target="_blank" rel="noreferrer"
			><Icon icon="mdi:github" class="w-10 h-10 hover:text-white" /></a
		>
		<a href="https://www.linkedin.com/in/forrestmeng629/" target="_blank" rel="noreferrer"
			><Icon icon="mdi:linkedin" class="w-10 h-10 hover:text-white" /></a
		>
		<a href="https://twitter.com/m_forrest" target="_blank" rel="noreferrer"
			><Icon icon="mdi:twitter" class="w-10 h-10 hover:text-white" /></a
		>
		<a
			href="https://devpost.com/forrestm113?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav"
			target="_blank"
			rel="noreferrer"
		>
			<Icon icon="simple-icons:devpost" class="w-10 h-10 hover:text-white" />
		</a>
		<a href="mailto:forrestm.a113@gmail.com" target="_blank" rel="noreferrer"
			><Icon icon="mdi:email" class="w-10 h-10 hover:text-white" /></a
		>
		
	</div>
</div>

<style>
	button.selected {
		color: white;
	}
</style>
