<script lang="ts">
	import { onMount } from 'svelte';

	let grid: string[][] = [];
	let gridOfWords: string[][] = [];
	let words: string[] = [];
	words = ['aboutme', 'work', 'projects', 'creations', 'blog', 'contact'];
	let coordWithLinks: any[] = [];
	let highlightedWord: string | null = null;
	let highlightAllBool: boolean = false;
	onMount(() => {
		initializeGrid();
	});
	function handleMouseOver(word: string) {
		if (word === '') {
			return;
		}
		if (highlightAllBool) {
			return;
		}
		highlightedWord = word;
	}

	function handleMouseLeave() {
		if (highlightAllBool) {
			return;
		}
		highlightedWord = null;
	}
	function initializeGrid() {
		const m = 9;
		const n = 12;

		grid = Array.from({ length: m }, () => Array(n).fill(''));
		gridOfWords = Array.from({ length: m }, () => Array(n).fill(''));
		addWordsToGrid();

		fillRemainingCells();
		console.log(gridOfWords);
	}
	function addWordsToGrid() {
		grid.forEach((row) => row.fill(''));

		words = shuffle(words);

		for (const word of words) {
			let placed = false;

			while (!placed) {
				const direction = Math.random() < 0.5 ? 'vertical' : 'horizontal';
				const [row, col] = getRandomStartPosition(word.length, direction);

				if (canPlaceWord(word, row, col, direction)) {
					placeWord(word.toUpperCase(), row, col, direction);
					placed = true;
					coordWithLinks.push([row, col, direction, word]);
				}
			}
		}
	}

	function canPlaceWord(
		word: string,
		startRow: number,
		startCol: number,
		direction: string
	): boolean {
		for (let i = 0; i < word.length; i++) {
			const currentRow = direction === 'vertical' ? startRow + i : startRow;
			const currentCol = direction === 'horizontal' ? startCol + i : startCol;

			if (grid[currentRow][currentCol] !== '' && grid[currentRow][currentCol] !== word[i]) {
				return false;
			}
		}

		return true;
	}

	function placeWord(word: string, startRow: number, startCol: number, direction: string) {
		for (let i = 0; i < word.length; i++) {
			const currentRow = direction === 'vertical' ? startRow + i : startRow;
			const currentCol = direction === 'horizontal' ? startCol + i : startCol;
			gridOfWords[currentRow][currentCol] = word;
			grid[currentRow][currentCol] += ' ' + word[i];
		}
	}

	function fillRemainingCells() {
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				if (grid[i][j] === '') {
					const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
					grid[i][j] = randomLetter;
				}
			}
		}
	}

	function getRandomStartPosition(wordLength: number, direction: string): [number, number] {
		const maxRow = direction === 'vertical' ? grid.length - wordLength : grid.length - 1;
		const maxCol = direction === 'horizontal' ? grid[0].length - wordLength : grid[0].length - 1;

		const row = Math.floor(Math.random() * (maxRow + 1));
		const col = Math.floor(Math.random() * (maxCol + 1));

		return [row, col];
	}

	function shuffle(array: string[]) {
		let currentIndex = array.length,
			randomIndex;

		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	}

	function handleClick(rowIndex: number, colIndex: number) {
		console.log(gridOfWords[rowIndex][colIndex]);
		if (gridOfWords[rowIndex][colIndex] === 'ABOUTME') {
			window.location.href = '/pages/aboutme';
		}
		if (gridOfWords[rowIndex][colIndex] === 'WORK') {
			window.location.href = '/pages/work';
		}
		if (gridOfWords[rowIndex][colIndex] === 'PROJECTS') {
			window.location.href = '/pages/projects';
		}
		if (gridOfWords[rowIndex][colIndex] === 'CREATIONS') {
			window.location.href = '/pages/creations';
		}
		if (gridOfWords[rowIndex][colIndex] === 'BLOG') {
			window.location.href = '/pages/blog';
		}
		if (gridOfWords[rowIndex][colIndex] === 'CONTACT') {
			window.location.href = '/pages/contact';
		}
	}

	function highlightAll() {
		highlightAllBool = true;
	}
</script>

<div class="h-screen max-h-screen flex justify-center items-center overflow-y-hidden crosswordMain">
	<div class=" mx-auto my-auto flex flex-col">
		<div class="word-finder">
			{#each grid as row, rowIndex}
				<div class="row">
					{#each row as cell, colIndex}
						<!-- svelte-ignore a11y-mouse-events-have-key-events -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<span
							class="cell transition-all {(gridOfWords[rowIndex][colIndex] === highlightedWord ||
								(highlightAllBool && gridOfWords[rowIndex][colIndex] != '')) &&
							highlightedWord !== ''
								? 'highlighted'
								: ''}"
							on:click={() => handleClick(rowIndex, colIndex)}
							on:mouseover={() => handleMouseOver(gridOfWords[rowIndex][colIndex])}
							on:mouseleave={handleMouseLeave}
						>
							{cell}
						</span>
					{/each}
				</div>
			{/each}
		</div>
		<button
			class="mx-auto mt-4 px-4 border-[#696969] text-[#696969] hover:border-white hover:text-white transition-all border-solid border-2 rounded-lg text-sm md:text-lg text-center "
			on:click={highlightAll}>s o l v e</button
		>
	</div>
</div>

<style>
	.word-finder {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.row {
		display: flex;
		justify-content: space-between;
	}

	.cell {
		width: 4rem;
		height: 4rem;
		margin: 0.1rem;
		font-size: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-family: 'Newsreader', serif;
		color: #555555;
	}

	.highlighted {
		color: #ffffff;
	}

	@media (max-width: 600px) {
		.cell {
			width: 1.6rem;
			height: 1.6rem;
			font-size: 0.8rem;
		}
	}
	@media (max-width: 1200px) and (min-width: 601px) {
		.cell {
			width: 3rem;
			height: 3rem;
			font-size: 1.5rem;
		}
	}
</style>
