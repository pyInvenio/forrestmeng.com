<div class="w-full h-full flex flex-col">
	<div class="w-full">
		<h1 class="text-4xl">Spacesight</h1>
		<h1 class="text-xl mt-2">
			Visualize and render how satellites look in space using realistic camera and lighting params
			<br />
			Built for SCOUT Inc. (Summer 2022)
		</h1>
	</div>
	<h1>
		<a
			href="https://spacesight.scout.space/"
			target="_blank"
			rel="noreferrer"
			class="font-medium text-2xl text-primary">Visit SpaceSight</a
		>
	</h1>
	<div class="w-full">
		<h1 class="text-2xl mt-2">Demo Video:</h1>

		<iframe
			src="https://www.youtube.com/embed/pIvEK2fVNek"
			frameborder="0"
			allowfullscreen
			title="SpaceSight"
			class="w-full aspect-video md:h-96 h-64 my-2"
		/>
	</div>
	<div class="my-2 space-y-2">
		<h1 class="text-xl">How I Built It</h1>
		<p>
			I was the sole developer on this project, using React, Three.js, and a backend that connected
			with Blender to render the images. Using webhooks, I was able to trigger the rendering process
			from the frontend, and then display the rendered images in the frontend as well as having
			multiple queues for rendering different images. Using camera lens and sensor equations, I was
			able to calculate the correct focal length and sensor size for each satellite, and then use
			Blender's camera and lighting tools to render the images through Cycles.
		</p>
	</div>
</div>
