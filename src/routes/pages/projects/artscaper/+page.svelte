<script>
	import Icon from '@iconify/svelte';
</script>

<div class="relative mx-auto flex  lg:w-[50%] w-[95%] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">Artscaper</h1>
			<h3 class="text-xl italic">
				Search Fast, Create Faster. The Next Generation Reference Tool for the Modern Artist
			</h3>
			<h3>
				<a
					href="https://artscaper.net/"
					target="_blank"
					class=" flex flex-row align-baseline text-center"
					>Visit<Icon icon="carbon:arrow-up-right" class="" /></a
				>
			</h3>
			<div class="my-4">
				<h1 class="text-2xl mt-2">Demo Video:</h1>

				<blockquote class="twitter-tweet mx-auto my-4">
					<p lang="en" dir="ltr">
						Hi everyone! I&#39;ve been working on this platform for a bit to help streamline image
						reference search and saving, and just released an alpha demo! Please test this out and
						let me know what you think!<a href="https://t.co/a9P6tkWcvM">https://t.co/a9P6tkWcvM</a>
						<a href="https://t.co/QAFQBfTnVl">pic.twitter.com/QAFQBfTnVl</a>
					</p>
					&mdash; 孟天同 (@fmeng__)<a
						href="https://twitter.com/fmeng__/status/1648162499353518081?ref_src=twsrc%5Etfw"
						>April 18, 2023</a
					>
				</blockquote>
				<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
				As a digital artist, I often find myself searching for reference images for my work, spending
				hours on search engines but still not finding what I need. I wanted to create a tool that would
				allow me to search for reference images quickly and efficiently, providing automated filters
				and classification of images based on my search terms. Talking with other artists, I found that
				this was a common problem, and that many visual illustrator artists struggle to find the perfect
				reference image for their work. Additionally, sharing and collaborating on reference boards is
				a commmon need for artists, but currently, there is no easy way to do this.
				<br />
				<br />
				Artscaper is a tool that solves these problems, allowing artists to search for reference images
				quickly and efficiently through AI query generation and latent space searching, and share and
				collaborate on reference boards with other artists. I was in the Startup Hokies Incubator, aiming
				to grow Artscaper into the best place for artists to save and share references.
				<br /><br />
				<img src="/softtech/artscapersearch.png" alt="" />
				The site was all written from scratch in Sveltekit, Typescript, TailwindCSS, Weaviate, GPT-3.5-turbo,
				Websockets, and .NET Core. We garnered over 50 signups for beta testing in April, and soft launched
				it with many industry professionals. Unfortunately, this project has been put on hiatus due to
				other circumstances. I was able to learn a lot about startup development and B2C products, as
				well as how to scale very reactive and interactive, real-time, and synchronized web applications.
				Since I was mostly the sole contributor to the project, I also learned the importance of having
				a cofounder.
			</div>
		</div>
	</div>
</div>

<style type="scss">
	img {
		@apply mx-auto max-h-64 my-4;
	}
	h1 {
		@apply text-2xl;
	}
</style>
