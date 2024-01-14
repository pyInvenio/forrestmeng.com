<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
	import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries.js';
	import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';

	let classifiers = [
		'Software',
		'Hardware',
		'Graphics',
		'AI/ML',
		'Finance',
		'Augmentation',
		'Hackathon'
	];
	let selected: { [key: string]: boolean } = {
		Software: false,
		Hardware: false,
		Graphics: false,
		'AI/ML': false,
		Finance: false,
		Augmentation: false,
		Hackathon: false
	};
	let mobius: HTMLDivElement;

	const addRemoveFromSelected = (className: string) => {
		selected[className] = !selected[className];
		filterProjects();
	};

	let projectMeta = {
		eqlo: {
			tags: ['Software', 'Finance'],
			summary: 'coming soon',
			thumbnail: '',
			link: 'https://eqlo.app/',
			date: 'Oct 2023'
		},
		'Semantic Communication - Wireless @ VT': {
			tags: ['Software', 'AI/ML'],
			summary: 'coming soon',
			thumbnail: '',
			link: '/pages/projects',
			date: 'Oct 2023'
		},
		'Internet Notes': {
			tags: ['Software'],
			summary: 'A place for the internet to post anonymous notes',
			thumbnail: '/softtech/internetnotes.png',
			link: 'https://internetnotes.vercel.app/',
			target:"_blank",
			date: 'June 2023'
		},
		'NeRF This': {
			tags: ['Software', 'Graphics', 'AI/ML'],
			summary: 'Using Stable Diffusion to improve visual accumulation in NeRFs',
			thumbnail: '/hardtech/progression_50.png',
			link: '/pages/projects/nerfthis',
			date: 'March 2023'
		},
		Artscaper: {
			tags: ['Software', 'AI/ML'],
			summary: 'A better image reference search and collaboration tool for visual artists',
			thumbnail: '/softtech/artscapersearch_50.png',
			link: '/pages/projects/artscaper',
			date: 'Dec 2022'
		},
		'SpO2 Sensor': {
			tags: ['Hardware'],
			summary: 'Building a heart rate and SpO2 monitor from scratch.',
			thumbnail: '/spo2bpm.jpg',
			link: '/pages/projects/spo2',
			date: 'Jan 2023'
		},
		'Latis Network': {
			tags: ['Software', 'Hardware'],
			summary: 'Using decentralized ledger technology to secure and validate OTA IIoT updates',
			thumbnail: '/hardtech/latismanuscreen.jpg',
			link: '/pages/projects/latis',
			date: 'Dec 2022'
		},
		'Research @ COLLAB': {
			tags: ['Software', 'Hardware', 'AI/ML', 'Augmentation'],
			summary: 'StROL: Stabilized and Robust Online Learning from Humans (Accepted into IEEE: Robotics and Automation Letters)',
			thumbnail: '/collab1.jpg',
			link: 'https://arxiv.org/pdf/2308.09863.pdf',
			date: 'Aug 2022'
		},
		"In My Feels": {
			tags: ['Software', 'AI/ML', 'Augmentation', 'Hackathon'],
			summary: 'BeReal but for your emotional state in VR',
			thumbnail: '/inmyfeels.png',
			link: 'https://devpost.com/software/in-my-feels',
			date: 'Jan 2023'
		},
		TALDERA: {
			tags: ['Software', 'AI/ML', 'Hackathon'],
			summary: 'Using the Cohere Generate API to summarize Discord chats',
			thumbnail: '/taldera.png',
			link: 'https://lablab.ai/event/cohere-thanksgiving-hackathon/CloseAI%20Deceptacons/TALDERA',
			date: 'Nov 2022'
		},
		'Haptic Glove': {
			tags: ['Hardware', 'Augmentation'],
			summary: 'Built my own DIY haptic glove for SteamVR',
			thumbnail: '/hapticglovecrop.jpg',
			link: '/pages/projects/hapticglove',
			date: 'July 2022'
		},
		'Haptic Tactics': {
			tags: ['Software', 'Hardware', 'Augmentation'],
			summary: 'Using VR and a haptic proxy to improve drilling in aerospace manufacturing.',
			thumbnail: '/hardtech/hapticdrillcrop.jpg',
			link: '/pages/projects/haptictactics',
			date: 'Feb 2022'
		},
		'Lowerbody Exoskeleton @ ARL': {
			tags: ['Software', 'Hardware', 'Augmentation'],
			summary: 'Predicting ',
			thumbnail: '/hardtech/arlexocrop.jpg',
			link: '/pages/projects/exo',
			date: 'Sept 2021'
		},
		QuizzAR: {
			tags: ['Software', 'Augmentation', 'Hackathon'],
			summary: 'Using a LEAP sensor with a quizlet-type unity game for financial literacy',
			thumbnail: '/quizar.jpg',
			link: 'https://devpost.com/software/finance-quizzar',
			date: 'Oct 2021'
		},
		'Coin Detection & Cubes': {
			tags: ['Software', 'AI/ML', 'Graphics'],
			summary: 'Some cool fundamental CV and graphics things',
			thumbnail: '/softtech/cannyedgecoins.png',
			link: '/pages/projects/cv',
			date: '2021'
		},
		COVILA: {
			tags: ['Software', 'Hardware', 'AI/ML'],
			summary: 'Human-tracking autonomous ball launcher',
			thumbnail: '/hardtech/covilaskate.jpg',
			link: '/pages/projects/covila',
			date: '2021'
		}
	};

	let filteredProjects: { [key: string]: any }[] = [];

	function filterProjects() {
		filteredProjects = Object.entries(projectMeta)
			.filter(([name, project]) => {
				if (Object.values(selected).every((value) => !value)) {
					return true;
				} else {
					return project.tags.some((tag) => selected[tag]);
				}
			})
			.map(([name, project]) => ({ name, ...project }));
	}

	onMount(() => {
		filterProjects();
		const onWindowResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			effect.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			if (window.innerWidth < 768) {
				camera.position.z = 10;
				camera.position.x = -1;
				camera.position.y = -2;

				mobiusStrip.rotation.x = Math.PI / 2 + 0.4;
			} else {
				camera.position.z = 10;
				camera.position.x = -4;
				camera.position.y = -2;
				mobiusStrip.rotation.x = Math.PI / 2 + 0.4;
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
		effect.domElement.style.color = '#bbbbbb';
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

		// create a mesh from the Möbius strip geometry and material
		const mobiusStrip = new THREE.Mesh(geometry, material);
		// rotate the mesh so that the strip is visible

		mobiusStrip.rotation.y = 0.4;

		if (window.innerWidth < 768) {
			camera.position.z = 10;
			camera.position.x = -1;
			camera.position.y = -2;

			mobiusStrip.rotation.x = Math.PI / 2 + 0.4;
		} else {
			camera.position.z = 10;
			camera.position.x = -4;
			camera.position.y = -2;
			mobiusStrip.rotation.x = Math.PI / 2 + 0.4;
		}

		// tilt the mesh so that the strip is visible

		// add the mesh to the scene
		scene.add(mobiusStrip);

		mobiusStrip.rotation.z = Math.PI / 1;

		const animate = () => {
			requestAnimationFrame(animate);
			effect.render(scene, camera);
			mobiusStrip.rotation.z -= 0.005;
		};
		animate();
		window.addEventListener('resize', onWindowResize, false);
	});

	$: {
		filterProjects();
	}
</script>

<div bind:this={mobius} class="absolute right-0 overflow-hidden top-0 -z-10" />

<div class="relative">
	<div class="relative mx-auto flex w-[min(86rem,95%)] flex-col justify-center my-8 z-10">
		<div class="w-full flex flex-col md:flex-row items-center">
			<div class="flex flex-col  lg:mr-0 mx-8 md:mt-0 mt-8">
				<h1 class="text-6xl">Projects</h1>
				<p class="text-xl">Things I've researched, ventured up, and made for fun.</p>
			</div>
		</div>
		<div class="flex overflow-y-auto md:flex-row items-left items-top my-8">
			{#each classifiers as className}
				<button
					class="px-4 py-2 rounded-full border-[1px] transition-all {selected[className]
						? 'bg-black text-white hover:border-gray-600 mx-2 hover:bg-gray-700 hover:text-white '
						: 'bg-white text-black hover:border-gray-300 mx-2 hover:bg-gray-100 hover:text-black '}"
					on:click={() => addRemoveFromSelected(className)}
				>
					{className}
				</button>
			{/each}
		</div>
		<div>
			{#each filteredProjects as project}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="bg-white flex flex-col md:flex-row w-full border-[1px] rounded-lg my-4 overflow-hidden opacity-90 hover:opacity-100 hover:drop-shadow-lg hover:border-gray-300 hover:cursor-pointer transition-all"
					on:click={() => goto(project.link)}
				>
					<div class="flex flex-col md:w-1/3 p-4 justify-between">
						<h1 class="text-2xl md:mt-4">{project.name}</h1>
						<p>{project.date}</p>
						<p>{project.summary}</p>
						<div class="flex flex-row flex-wrap gap-x-2">
							{#each project.tags as tag}
								<p class="italic text-sm px-1 rounded-full border-[1px]">{tag}</p>
							{/each}
						</div>
					</div>
					<div class="md:w-2/3">
						<img
							src={project.thumbnail}
							alt=""
							class="md:max-h-48 max-h-24 object-cover w-full object-top"
							loading="lazy"
						/>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
