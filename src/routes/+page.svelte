<script lang="ts">
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
	import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries.js';
	import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
	let mobius: HTMLDivElement;

    // for 

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

<div bind:this={mobius} class="absolute mx-auto my-auto overflow-hidden top-0" />

<div class="max-w-[80%] mx-auto my-10">
	<div class="space-y-4 my-[15%]">
		<h1 class="text-5xl font-medium ">Forrest Meng</h1>
		<h1 class="text-5xl font-extralight opacity-75">Engineer. Developer. Illustrator.</h1>
	</div>

	<!-- div that is at bottom left corner, not absolute -->
	<div class="flex flex-col items-start">
		<div class="flex flex-row space-x-4">
			
		</div>
	</div>
</div>
