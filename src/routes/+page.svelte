<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { onMount } from 'svelte';

	interface WordEntry {
		word: string;
		url: string;
		placed?: boolean;
		startRow?: number;
		startCol?: number;
		direction?: 'horizontal' | 'vertical';
	}

	let grid: string[][] = $state([]);
	let gridOfWords: string[][][] = $state([]); // Now stores arrays of words for each cell
	let words: WordEntry[] = $state([
		{ word: 'ABOUTME', url: '/pages/aboutme' },
		{ word: 'WORK', url: '/pages/work' },
		{ word: 'PROJECTS', url: '/pages/projects' },
		{ word: 'CREATIONS', url: '/pages/creations' },
		{ word: 'BLOG', url: '/pages/blog' },
		{ word: 'CONTACT', url: '/pages/contact' }
	]);

	let highlightedWord: string | null = $state(null);
	let highlightAllBool: boolean = $state(false);

	onMount(() => {
		initializeGrid();
	});

	function initializeGrid() {
		const m = 12;
		const n = 15;

		grid = Array.from({ length: m }, () => Array(n).fill(''));
		gridOfWords = Array.from({ length: m }, () => Array.from({ length: n }, () => []));

		placeWordsWithOverlaps();
		fillRemainingCells();
	}

	function placeWordsWithOverlaps() {
		words = shuffle([...words]);

		// Place first word randomly
		const firstWord = words[0];
		const direction = Math.random() < 0.5 ? 'vertical' : 'horizontal';
		const [row, col] = getRandomStartPosition(firstWord.word.length, direction);
		placeWord(firstWord.word, row, col, direction);
		firstWord.placed = true;
		firstWord.startRow = row;
		firstWord.startCol = col;
		firstWord.direction = direction;

		// Try to place remaining words with overlaps
		for (let i = 1; i < words.length; i++) {
			const word = words[i];
			let placed = false;
			let attempts = 0;
			const maxAttempts = 100;

			while (!placed && attempts < maxAttempts) {
				// Try to find overlap with already placed words
				const overlapPosition = findOverlapPosition(word.word);
				if (overlapPosition) {
					const { row, col, direction } = overlapPosition;
					if (canPlaceWordWithOverlap(word.word, row, col, direction)) {
						placeWord(word.word, row, col, direction);
						word.placed = true;
						word.startRow = row;
						word.startCol = col;
						word.direction = direction;
						placed = true;
					}
				}

				// If no overlap found, try random placement
				if (!placed) {
					const direction = Math.random() < 0.5 ? 'vertical' : 'horizontal';
					const [row, col] = getRandomStartPosition(word.word.length, direction);
					if (canPlaceWordWithOverlap(word.word, row, col, direction)) {
						placeWord(word.word, row, col, direction);
						word.placed = true;
						word.startRow = row;
						word.startCol = col;
						word.direction = direction;
						placed = true;
					}
				}
				attempts++;
			}
		}
	}

	function findOverlapPosition(newWord: string): { row: number; col: number; direction: 'horizontal' | 'vertical' } | null {
		const placedWords = words.filter(w => w.placed);

		for (const placedWord of placedWords) {
			if (!placedWord.startRow || !placedWord.startCol || !placedWord.direction) continue;

			// Find common letters
			for (let i = 0; i < newWord.length; i++) {
				for (let j = 0; j < placedWord.word.length; j++) {
					if (newWord[i] === placedWord.word[j]) {
						// Calculate position for perpendicular placement
						if (placedWord.direction === 'horizontal') {
							// Place new word vertically
							const row = placedWord.startRow - i;
							const col = placedWord.startCol + j;
							if (row >= 0 && row + newWord.length <= grid.length) {
								return { row, col, direction: 'vertical' };
							}
						} else {
							// Place new word horizontally
							const row = placedWord.startRow + j;
							const col = placedWord.startCol - i;
							if (col >= 0 && col + newWord.length <= grid[0].length) {
								return { row, col, direction: 'horizontal' };
							}
						}
					}
				}
			}
		}
		return null;
	}

	function canPlaceWordWithOverlap(word: string, startRow: number, startCol: number, direction: string): boolean {
		if (startRow < 0 || startCol < 0) return false;

		for (let i = 0; i < word.length; i++) {
			const currentRow = direction === 'vertical' ? startRow + i : startRow;
			const currentCol = direction === 'horizontal' ? startCol + i : startCol;

			if (currentRow >= grid.length || currentCol >= grid[0].length) return false;

			// If cell is not empty, it must match the letter we're trying to place
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
			grid[currentRow][currentCol] = word[i];
			gridOfWords[currentRow][currentCol].push(word);
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

	function shuffle(array: WordEntry[]) {
		const newArray = [...array];
		let currentIndex = newArray.length;

		while (currentIndex !== 0) {
			const randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			const temp = newArray[currentIndex];
			newArray[currentIndex] = newArray[randomIndex];
			newArray[randomIndex] = temp;
		}

		return newArray;
	}

	function handleMouseOver(rowIndex: number, colIndex: number) {
		if (highlightAllBool) return;

		const wordsAtCell = gridOfWords[rowIndex][colIndex];
		if (wordsAtCell.length === 0) return;

		// If multiple words, randomly choose one, or use the currently highlighted one if it's in the list
		if (highlightedWord && wordsAtCell.includes(highlightedWord)) {
			// Keep current highlighted word if it's still valid for this cell
			return;
		}

		// Randomly select a word from the available words at this cell
		const randomIndex = Math.floor(Math.random() * wordsAtCell.length);
		highlightedWord = wordsAtCell[randomIndex];
	}

	function handleMouseLeave() {
		if (highlightAllBool) return;
		highlightedWord = null;
	}

	function handleClick(rowIndex: number, colIndex: number) {
		const wordsAtCell = gridOfWords[rowIndex][colIndex];
		if (wordsAtCell.length === 0) return;

		// Use the currently highlighted word if available, otherwise pick the first one
		const targetWord = highlightedWord && wordsAtCell.includes(highlightedWord)
			? highlightedWord
			: wordsAtCell[0];

		const wordEntry = words.find(w => w.word === targetWord);
		if (wordEntry) {
			window.location.href = wordEntry.url;
		}
	}

	function highlightAll() {
		highlightAllBool = true;
		highlightedWord = null; // Clear individual word highlighting
	}
</script>

<SEO description="Personal website of Forrest Meng — engineer, researcher, and creative working in emerging tech, startups, and art." url="/" />

<div class="h-screen max-h-screen flex justify-center items-center overflow-y-hidden crosswordMain">
	<div class=" mx-auto my-auto flex flex-col">
		<div class="word-finder">
			{#each grid as row, rowIndex}
				<div class="row">
					{#each row as cell, colIndex}
						<!-- svelte-ignore a11y_mouse_events_have_key_events -->
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<span
							class="cell transition-all {(highlightedWord && gridOfWords[rowIndex][colIndex].includes(highlightedWord)) ||
								(highlightAllBool && gridOfWords[rowIndex][colIndex].length > 0)
								? 'highlighted'
								: ''}"
							onclick={() => handleClick(rowIndex, colIndex)}
							onmouseover={() => handleMouseOver(rowIndex, colIndex)}
							onmouseleave={handleMouseLeave}
							role="button"
							tabindex="0"
						>
							{cell}
						</span>
					{/each}
				</div>
			{/each}
		</div>
		<button
			class="mx-auto mt-4 px-4 border-[#696969] text-[#696969] hover:border-white hover:text-white transition-all border-solid border-2 rounded-lg text-sm md:text-lg text-center "
			onclick={highlightAll}>s o l v e</button
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
