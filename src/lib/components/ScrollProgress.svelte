<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let pattern: boolean[][] = [];
	let noise: number[][] = [];
	let progress = 0;

	const CELL = 2;
	const ROWS = 5;
	const EDGE_WIDTH = 30;

	function rule184(l: boolean, c: boolean, r: boolean): boolean {
		const i = (l ? 4 : 0) + (c ? 2 : 0) + (r ? 1 : 0);
		return [false, false, false, true, true, true, false, true][i];
	}
	function rule110(l: boolean, c: boolean, r: boolean): boolean {
		const i = (l ? 4 : 0) + (c ? 2 : 0) + (r ? 1 : 0);
		return [false, true, true, true, false, true, true, false][i];
	}
	function rule90(l: boolean, _c: boolean, r: boolean): boolean {
		return l !== r;
	}
	function rule54(l: boolean, c: boolean, r: boolean): boolean {
		const i = (l ? 4 : 0) + (c ? 2 : 0) + (r ? 1 : 0);
		return [false, true, true, false, true, true, false, false][i];
	}

	type Rule = (l: boolean, c: boolean, r: boolean) => boolean;
	const rules: Rule[] = [rule184, rule110, rule90, rule54];
	let activeRule: Rule = rules[0];

	function generate(cols: number) {
		activeRule = rules[Math.floor(Math.random() * rules.length)];
		pattern = [];
		noise = [];
		const seed = Array.from({ length: cols }, () => Math.random() < 0.35);
		pattern.push(seed);
		noise.push(seed.map(() => Math.random()));

		for (let r = 1; r < ROWS; r++) {
			const prev = pattern[r - 1];
			const row = prev.map((_, c) =>
				activeRule(c > 0 ? prev[c - 1] : false, prev[c], c < cols - 1 ? prev[c + 1] : false)
			);
			pattern.push(row);
			noise.push(row.map(() => Math.random()));
		}
	}

	function draw() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const cols = Math.ceil(canvas.width / CELL);
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let r = 0; r < ROWS; r++) {
			if (!pattern[r]) continue;
			for (let c = 0; c < cols; c++) {
				if (!pattern[r][c]) continue;

				const cellPos = c / cols;
				if (cellPos > progress) continue;

				const distFromEdge = (progress - cellPos) * cols;
				if (distFromEdge < EDGE_WIDTH) {
					if (noise[r][c] > distFromEdge / EDGE_WIDTH) continue;
				}

				const t = cellPos / Math.max(progress, 0.001);
				const lightness = Math.round(200 - t * 130); // 200 (light gray) → 70 (dark gray)
				ctx.fillStyle = `rgb(${lightness},${lightness},${lightness})`;
				ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
			}
		}
	}

	function onScroll() {
		const total = document.documentElement.scrollHeight - window.innerHeight;
		progress = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
		draw();
	}

	function onResize() {
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = ROWS * CELL;
		generate(Math.ceil(canvas.width / CELL));
		draw();
	}

	onMount(() => {
		onResize();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="fixed top-0 left-0 w-full z-50 pointer-events-none"
	style="height: {ROWS * CELL}px"
></canvas>
