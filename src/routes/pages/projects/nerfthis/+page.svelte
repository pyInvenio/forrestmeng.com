<script>
	import Icon from '@iconify/svelte';
</script>

<div class="relative mx-auto flex  lg:w-[50%] w-[95%] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">NeRF This!</h1>
			<h3 class="text-xl italic">Diffusion-based Visual Accumulation</h3>
			<h3>
				<a
					href="https://github.com/alxn3/NeRF-This"
					target="_blank"
					class=" flex flex-row align-baseline text-center"
					>Github<Icon icon="carbon:arrow-up-right" class="" /></a
				>
			</h3>
			<h3>
				<a
					href="/NeRF_This.pdf"
					target="_blank"
					class=" flex flex-row align-baseline text-center"
					>Project Paper<Icon icon="carbon:arrow-up-right" class="" /></a
				>
			</h3>
			<div class="my-4" >
				<h1>The Research Problem</h1>
				Neural Radiance Fields are a prominent way of synthesizing 3D scenes from image and video
			captures. However, for many casual users who capture NeRFs and other instances related to
			limitations with cameras, the initial input data to the NeRF may be low quality or inadequate
			to have high accumulation and confidence in consensus. As NeRFs tend to overfit on input data
			for better accumulation and density, not having enough input views to provide high-density
			accumulation can lead to artifacts such as floaters, clouds, and general noise where an
			element of the NeRF is supposed to be present.
			<img src="/hardtech/pipeline.png" alt="" class="object-contain md:w-[90%]  mx-auto" />
			<h1>Our Approach</h1>
			Our approach samples accumulation and information from a prior NeRF with low accumulation and
			noise, perform noise detection and masking, in-paints the areas with a low prompt guidance
			diffusion model, and iteratively replaces and retrains the NeRF for gradual accumulation and
			consensus. Our method improves the accumulation density of NeRFs and can be an effective
			solution for casual users with low-quality input data.
			<img src="/hardtech/camerawalk.png" alt="" class="object-contain md:w-[80%] mx-auto" />
			In NeRFStudio, we implemented a camera walk method that stochastically moves a camera around
			the NeRF to generate new views according to the NeRF's normals at a certain point. This allows
			for more controlled and accurate camera placement.
			<img src="/hardtech/inpaint.png" alt="" class="object-contain md:w-[80%] mx-auto" />
			We then took the rendered image at each of the new view points, and used KMeans as well as the
			Laplacian Filter to create masks that held all areas with low resolution and low accumulation.
			These places would be then inpainted with a low prompt guidance diffusion model. We do this
			iteratively and while the NeRF is finetuning, so that we can gradually improve the NeRF's
			accumulation and consensus while maintaining the NeRF's original structure.
			<img src="/hardtech/progression.png" alt="" class="object-contain md:w-[80%] mx-auto" />

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
