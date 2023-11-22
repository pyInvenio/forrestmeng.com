<script>
	let showMenu = false;
	const toggleMenu = () => {
		showMenu = !showMenu;
	};

	const closeMenu = () => {
		showMenu = false;
	};
</script>

<svelte:window on:resize={closeMenu} />
<nav
	class="w-full justify-between flex flex-row text-2xl lg:px-16 px-8 py-4 z-30 bg-white bg-opacity-60"
>
	<h1><a href="/" class="hover:no-underline">Forrest Meng</a></h1>
	<div class="hidden lg:flex flex-row gap-x-4">
		<p><a href="/pages/aboutme">About Me</a></p>
		<p><a href="/pages/work">Work</a></p>
		<p><a href="/pages/projects">Projects</a></p>
		<p><a href="/pages/creations">Creations</a></p>
		<p><a href="/pages/blog">Thoughts & Findings</a></p>
		<p><a href="/pages/contact">Contact</a></p>
	</div>
	<div class="lg:hidden flex items-center">
		<!-- <div class="hidden w-6 justify-center md:flex"><ThemeToggle /></div> -->
		<button
			type="button"
			class="flex text-black hover:text-black focus:outline-none lg:hidden"
			on:click={toggleMenu}
			on:keypress={toggleMenu}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
		</button>
	</div>
</nav>
<div
	class=" absolute top-0 z-20 mt-16 w-full overflow-hidden lg:hidden {(!showMenu &&
		'pointer-events-none') ||
		''}"
>
	<div
		class="bg-white p-8 pb-4 transition-transform  border-b-[1px] {showMenu
			? 'translate-y-0'
			: 'pointer-events-none -translate-y-[100%]'}"
	>
		<div class="flex lg:hidden flex-col gap-x-2">
			<p><a href="/pages/aboutme" on:click={toggleMenu}>About Me</a></p>
			<p><a href="/pages/work" on:click={toggleMenu}>Work</a></p>
			<p><a href="/pages/projects" on:click={toggleMenu}>Projects</a></p>
			<p><a href="/pages/creations" on:click={toggleMenu}>Creations</a></p>
			<p><a href="/pages/blog" on:click={toggleMenu}>Thoughts & Findings</a></p>
			<p><a href="/pages/contact" on:click={toggleMenu}>Contact</a></p>
		</div>
	</div>
</div>
