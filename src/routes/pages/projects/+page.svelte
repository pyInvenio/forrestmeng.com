<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let classifiers = ['Software', 'Hardware', 'Graphics', 'AI/ML', 'Finance', 'Augmentation'];
	let selected: { [key: string]: boolean } = {
		Software: false,
		Hardware: false,
		Graphics: false,
		'AI/ML': false,
		Finance: false,
		Augmentation: false
	};

	const addRemoveFromSelected = (className: string) => {
		selected[className] = !selected[className];
		filterProjects();
	};

	let projectMeta = {
		'NeRF This': {
			tags: ['Software', 'Graphics', 'AI/ML'],
			summary: 'asdfghjk',
			thumbnail: '/hardtech/progression.png',
			link: '/pages/projects/nerfthis',
			date: 'March 2023'
		},
		Artscaper: {
			tags: ['Software', 'AI/ML'],
			summary: 'asdfghjk',
			thumbnail: '/softtech/artscapersearch.png',
			link: '/pages/projects/artscaper',
			date: 'Dec 2022'
		},
		'Latis Network': {
			tags: ['Software', 'Hardware'],
			summary: 'asdfghjk',
			thumbnail: '/hardtech/latismanuscreen.jpg',
			link: '/pages/projects/latis',
			date: 'Dec 2022'
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
	});

	$: {
		filterProjects();
	}
</script>

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
					class="flex flex-col md:flex-row w-full border-[1px] rounded-lg my-4 overflow-hidden opacity-90 hover:opacity-100 hover:drop-shadow-lg hover:border-gray-300 hover:cursor-pointer transition-all"
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
						<img src={project.thumbnail} alt="" class="md:max-h-48 max-h-24 object-cover w-full" />
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
