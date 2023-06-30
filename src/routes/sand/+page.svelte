<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	let canvas: HTMLCanvasElement;
	import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
	import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';

	let userText = 'Hello';
	let allowUserType = true;

	onMount(async () => {
		let scene: THREE.Scene,
			camera: THREE.PerspectiveCamera,
			geometry,
			color: THREE.Color,
			material: THREE.MeshStandardMaterial,
			mesh: THREE.Mesh;
		color = new THREE.Color(0xffffff);
		let particles: any = {};
		let id = 0;
		// Create scene
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.BasicShadowMap;
		// Create a light for Metallic spheres
		const light = new THREE.PointLight(0xffffff, 10, 1000);
		light.position.set(10, 100, 10);
		light.castShadow = true;

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		ambientLight.position.set(0, 10, 0);
		ambientLight.castShadow = true;
		scene.add(ambientLight);
		scene.add(light);
		let ground = new THREE.Mesh(
			new THREE.PlaneGeometry(10000, 1000, 1, 1),
			new THREE.MeshStandardMaterial({ color: 0x055 })
		);
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = -50;
		ground.receiveShadow = true;
		ground.castShadow = false;
		scene.add(ground);

		const particleGeometry = new THREE.BoxGeometry(10, 10, 10);
		const matrix = new THREE.Matrix4(); // for positioning each particle
		const position = new THREE.Vector3(); // holds the vertex position

		renderer.setSize(window.innerWidth, window.innerHeight);
		let loader = new FontLoader();
		let font: Font;
		loader.load(
			'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
			function (loadedFont) {
				font = loadedFont;
				// Call the initial update to generate the default text
				updateTextGeometry();
			}
		);
		// Set camera position
		camera.position.z = 500;

		// Animation
		const animate = () => {
			requestAnimationFrame(animate);
			renderer.render(scene, camera);
		};
		animate();

		window.addEventListener('resize', onWindowResize, false);

		function onWindowResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		const randomColor = () => {
			return Math.floor((Math.random() * 16777215) / 2 + 16777215 / 2);
		};
		// User input
		window.addEventListener('keydown', (event) => {
			if (allowUserType) {
				if (event.key === 'Backspace') {
					userText = userText.slice(0, -1);
				} else if (event.key === 'Enter') {
					color = new THREE.Color(randomColor());
					erode();
					if (mesh) {
						scene.remove(mesh);
					}
					userText = '';
				} else if (event.key.length === 1) {
					userText += event.key;
					updateTextGeometry();
				}
			}
		});
		let acceleration = 0.3;
		async function erode() {
			for (let i = 0; i < mesh.geometry.attributes.position.count; i += 10) {
				position.fromBufferAttribute(mesh.geometry.attributes.position as any, i); // get the vertex position

				matrix.setPosition(position); // move the matrix to vertex position

				// create new particle and add to scene
				const particle = new THREE.Mesh(particleGeometry);
				particle.castShadow = true;
				particle.receiveShadow = true;
				particle.material = material;
				particle.name = 'particle';
				particle.applyMatrix4(matrix);
				scene.add(particle);
				particles[particle.id] = 1;
			}
			while (true) {
				await new Promise((r) => setTimeout(r, 50));
				erodeStep();
				for (let i = 0; i < scene.children.length; i++) {
					if (scene.children[i].name === 'particle') {
						if (scene.children[i].position.y < -50) {
							particles[scene.children[i].id] = 0;
							scene.remove(scene.children[i]);
						}
					}
				}
			}
		}

		function erodeStep() {
			scene.traverse((child) => {
				if (child.name === 'particle') {
					particles[child.id] += acceleration;
					child.position.y -= Math.random() * particles[child.id]; // randomly make particles fall
				}
			});
		}

		async function updateTextGeometry() {
			// Get the updated text from the input field
			let updatedText = userText;

			// Remove the existing text mesh from the scene
			if (mesh) {
				scene.remove(mesh);
			}
			material = new THREE.MeshStandardMaterial({ color: color });
			// Create the updated text geometry
			let updatedGeometry = new TextGeometry(updatedText, {
				font: font,
				size: 40,
				height: 5,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 10,
				bevelSize: 1,
				bevelOffset: 0,
				bevelSegments: 5
			});
			updatedGeometry.center();

			// Create the updated text mesh
			let updatedMesh = new THREE.Mesh(updatedGeometry, material);
			updatedMesh.castShadow = true;
			updatedMesh.receiveShadow = true;

			// Add the updated text mesh to the scene
			scene.add(updatedMesh);

			// Set the global mesh variable to the updated mesh
			mesh = updatedMesh;
		}
	});
</script>

<svelte:head>
	<style>
		canvas {
			position: absolute;
			top: 0;
			left: 0;
		}
	</style>
</svelte:head>

<canvas bind:this={canvas} />
