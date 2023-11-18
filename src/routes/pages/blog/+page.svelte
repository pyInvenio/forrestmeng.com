<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let classifiers = [
		'Tech',
		'Art',
		'Graphics',
		'AI/ML'
		// 'Finance'
	];
	let selected: { [key: string]: boolean } = {
		Tech: false,
		Art: false,
		Graphics: false,
		'AI/ML': false
		// Finance: false,
	};

	const addRemoveFromSelected = (className: string) => {
		selected[className] = !selected[className];
		filterPosts();
	};

	let blogposts = {
		'The CEO Problem': {
			tags: ['Tech', 'AI/ML'],
			link: '/pages/blog/ceoproblem',
			date: 'Nov 2, 2023'
		},
		'Quadtrees overview': {
			tags: ['Tech', 'Graphics'],
			link: '/pages/blog/quadtrees',
			date: 'Jul 27, 2023'
		},
		'0xbb40e64e': {
			tags: ['Tech'],
			link: '/pages/blog/microsoftpi',
			date: 'Jun 29, 2023'
		},
		'XR UX should be Edible': {
			tags: ['Tech'],
			link: '/pages/blog/ediblexr',
			date: 'Jun 9, 2023'
		},
		'Editing NeRFs': {
			tags: ['Tech', 'AI/ML', 'Graphics'],
			link: '/pages/blog/editingnerfs',
			date: 'May 12, 2023'
		},
		'Latis - Consensus Based IoT Security': {
			tags: ['Tech'],
			link: '/pages/blog/latis',
			date: 'Apr 29, 2023'
		},
		'Density speaks volumes, about Neural Radiance Fields (NeRFs)': {
			tags: ['Tech', 'AI/ML', 'Graphics'],
			link: '/pages/blog/nerfs',
			date: 'Apr 7, 2023'
		},
		'Impressionism’s Impression': {
			tags: ['Art'],
			link: '/pages/blog/impressionism',
			date: 'Mar 30, 2023'
		},
		'AI Alignment is only a probabilistic process': {
			tags: ['Tech', 'AI/ML'],
			link: '/pages/blog/aialignment',
			date: 'Mar 18, 2023'
		},
		'Interviewing ChatDS': {
			tags: ['Tech', 'AI/ML'],
			link: '/pages/blog/chatds',
			date: 'Mar 7, 2023'
		},
		'A dip into Inverse Rendering': {
			tags: ['Tech', 'Graphics'],
			link: '/pages/blog/inverserendering',
			date: 'Feb 18, 2023'
		}
	};

	let filteredPosts: { [key: string]: any }[] = [];

	function filterPosts() {
		filteredPosts = Object.entries(blogposts)
			.filter(([name, post]) => {
				if (Object.values(selected).every((value) => !value)) {
					return true;
				} else {
					return post.tags.some((tag) => selected[tag]);
				}
			})
			.map(([name, post]) => ({ name, ...post }));
	}

	onMount(() => {
		filterPosts();
	});

	$: {
		filterPosts();
	}
</script>

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
						<h1 class="text-2xl">{post.name}</h1>

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
