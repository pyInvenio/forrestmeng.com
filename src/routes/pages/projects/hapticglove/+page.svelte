<script>
	import Icon from '@iconify/svelte';
</script>

<div class="relative mx-auto flex  lg:w-[50%] w-[95%] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">Haptic Glove</h1>
			<h3 class="text-xl italic">Building a cost-efficient DIY Haptic Glove for VR environments</h3>
			<div class="my-4">
				<iframe
					src="https://drive.google.com/file/d/1x_jwaSbN3J27cfDXrntzuIOdBH8D_hOn/preview"
					frameborder="0"
					allowfullscreen
					title="Artscaper"
					class="w-full aspect-video md:h-96 h-64 my-2"
				/>
				<br /><br />
				<h1>The Project</h1>
				I built this haptic glove that can simulate touch in VR environments. The glove is mostly inspired
				from LucidVR Haptic Glove build, with some slight modifications to make it more comfortable for
				me. The glove is made of 3D printed parts, and uses an ESP32 microcontroller to control the servos
				which lock finger rotation.
				<br /><br />In this quick build, I learned about how a driver is coded and can be used to
				integrate control from SteamVR into a microcontroller. I also was able to use my new 3D
				printer to make custom parts for the glove. I found that haptic gloves is still needing a
				lot of work, and that there is a lot of room for improvement, such as easier and more
				accessible ways to wear the glove, technology to simulate shear force, and having more
				immersive haptic illusion.
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
