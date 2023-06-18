<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
	import { World, Sphere, Plane, Body, NaiveBroadphase, Vec3 } from 'cannon-es';
	let canvas: HTMLCanvasElement;
	let n = 1000; // Default number of spheres

	onMount(async () => {
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const world = new World();
		world.gravity.set(0, -9.82, 0);
		world.broadphase = new NaiveBroadphase();

		const planeBody = new Body({ mass: 0 });
		planeBody.addShape(new Plane());
		planeBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
		world.addBody(planeBody);

		const rightWall = new Body({ mass: 0 });
		rightWall.addShape(new Plane());
		rightWall.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), -Math.PI / 2);
		rightWall.position.set(5, 0, 0);
		world.addBody(rightWall);

		const leftWall = new Body({ mass: 0 });
		leftWall.addShape(new Plane());
		leftWall.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);
		leftWall.position.set(-5, 0, 0);
		world.addBody(leftWall);

		const backWall = new Body({ mass: 0 });
		backWall.addShape(new Plane());
		backWall.position.set(0, 0, -5);
		world.addBody(backWall);

		const frontWall = new Body({ mass: 0 });
		frontWall.addShape(new Plane());
		frontWall.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI);
		frontWall.position.set(0, 0, 5);
		world.addBody(frontWall);

		// Create a scene, camera, and renderer
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.BasicShadowMap;
		// Create a light for Metallic spheres
		const light = new THREE.PointLight(0xffffff, 1, 100);
		light.position.set(10, 10, 10);
		light.castShadow = true;

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		ambientLight.position.set(0, 10, 0);
		ambientLight.castShadow = true;
		scene.add(ambientLight);
		scene.add(light);

		// DragControls for drag and drop
		const spheres = createSpheres(scene);

		const dragControls = new DragControls(spheres, camera, renderer.domElement);
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.touches = {
			TWO: THREE.TOUCH.ROTATE,
			ONE: THREE.TOUCH.DOLLY_PAN
		};
		// Disable rotation while dragging
		dragControls.addEventListener('dragstart', function (_event) {
			controls.enabled = false;
		});

		dragControls.addEventListener('dragend', function (_event) {
			controls.enabled = true;
		});

		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.screenSpacePanning = false;
		controls.minDistance = 1;
		controls.maxDistance = 100;
		controls.maxPolarAngle = Math.PI / 2;
		controls.update();

		// Create a plane
		const planeGeometry = new THREE.PlaneGeometry(10, 10);
		const planeMaterial = new THREE.MeshStandardMaterial({
			color: 0xcccccc,
			side: THREE.DoubleSide
		});
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.castShadow = false;
		plane.receiveShadow = true;
		plane.rotation.x = Math.PI / 2;

		scene.add(plane);

		camera.position.z = 10;
		camera.position.x = -1;
		camera.position.y = 5;
		camera.lookAt(0, 0, 0);

		function render() {
			renderer.render(scene, camera);
		}
		let dt = 1 / 60;
		function animate() {
			requestAnimationFrame(animate);

			// update physics
			world.step(dt);

			// copy positions from physics world to Three.js scene
			spheres.forEach((sphere) => {
				sphere.position.copy(sphere.userData.physicsBody.position);
				sphere.quaternion.copy(sphere.userData.physicsBody.quaternion);
			});
			controls.update();
			render();
		}

		function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
			const canvas = renderer.domElement;
			const pixelRatio = window.devicePixelRatio;
			const width = (canvas.clientWidth * pixelRatio) | 0;
			const height = (canvas.clientHeight * pixelRatio) | 0;
			const needResize = canvas.width !== width || canvas.height !== height;
			if (needResize) {
				renderer.setSize(width, height, false);
			}
			console.log(width, height);
			return needResize;
		}

		function onWindowResize() {
			if (resizeRendererToDisplaySize(renderer)) {
				const canvas = renderer.domElement;
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();
				render();
			}
		}
		onWindowResize();
		window.addEventListener('resize', onWindowResize);
		animate();
		return () => {
			window.removeEventListener('resize', onWindowResize);
		};
		function createSpheres(scene: THREE.Scene) {
			const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
			const materials = [
				new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8, roughness: 0.5 }),
				new THREE.MeshStandardMaterial({ color: 0x00ff00, metalness: 0.5, roughness: 0 }),
				new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.5, roughness: 0 }),
				new THREE.MeshStandardMaterial({ color: 0xffff00, metalness: 0.5, roughness: 0 }),
				new THREE.MeshStandardMaterial({ color: 0xff00ff, metalness: 0.5, roughness: 0 })
			];

			const spheres = [];

			for (let i = 0; i < n; i++) {
				const sphereMaterial = materials[i % materials.length];
				const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
				sphere.position.set((Math.random() - 0.5) * 8, 0.5, (Math.random() - 0.5) * 8);
				spheres.push(sphere);
				sphere.castShadow = true;
				sphere.receiveShadow = true;
				scene.add(sphere);
				const sphereShape = new Sphere(0.5);
				const sphereBody = new Body({ mass: 1 });
				sphereBody.addShape(sphereShape);
				sphereBody.position.set(sphere.position.x, sphere.position.y, sphere.position.z);
				world.addBody(sphereBody);
				sphere.userData.physicsBody = sphereBody;
			}

			return spheres;
		}
	});
</script>

<canvas bind:this={canvas} class="h-screen w-screen" />
