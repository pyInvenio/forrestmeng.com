<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';
	import type { BlogPost } from '$lib/utils/blog';

	export let data: { posts: BlogPost[] };

	let classifiers = [
		'Tech',
		'Art',
		'Graphics',
		'AI/ML'
	];
	let selected: { [key: string]: boolean } = {
		Tech: false,
		Art: false,
		Graphics: false,
		'AI/ML': false
	};

	const addRemoveFromSelected = (className: string) => {
		selected[className] = !selected[className];
		filterPosts();
	};

	let filteredPosts: BlogPost[] = [];

	function filterPosts() {
		filteredPosts = data.posts.filter((post) => {
			if (Object.values(selected).every((value) => !value)) {
				return true;
			} else {
				return post.tags.some((tag) => selected[tag]);
			}
		});
	}

	onMount(() => {
		filterPosts();
	});

	$: {
		filterPosts();
	}
</script>

<SEO title="Blog" description="Things I've written up about tech, art, and new findings." url="/pages/blog" />

<div class="relative">
	<div class="relative mx-auto flex w-[min(86rem,95%)] flex-col justify-center my-8 z-10">
		<div class="w-full flex flex-col md:flex-row items-center">
			<div class="flex flex-col  lg:mr-0 mx-8 md:mt-0 mt-8">
				<h1 class="text-6xl">Blog</h1>
				<p class="text-xl">Things I've written up about tech, art, and new findings.</p>
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
			{#each filteredPosts as post}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="bg-white flex flex-col md:flex-row justify-between w-full py-4 overflow-hidden opacity-90 hover:opacity-100 hover:drop-shadow-lg  hover:cursor-pointer transition-all md:align-middle md:items-center md:border-b-0 border-b-[1px]"
					on:click={() => goto(post.link)}
				>
					<div class="flex flex-col p-4 justify-between">
						<h1 class="text-2xl">{post.title}</h1>

						<div class="flex flex-row flex-wrap gap-x-2">
							{#each post.tags as tag}
								<p class="italic text-sm px-1 rounded-full border-[1px]">{tag}</p>
							{/each}
						</div>
					</div>
					<div class=" px-4">
						<p>{post.date}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
