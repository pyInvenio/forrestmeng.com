<div>
	<div class="w-full">
		<h1 class="text-4xl">NeRF This!</h1>
		<h1 class="text-xl mt-2">Diffusion-based Visual Accumulation</h1>
		<h1 class="text-xl mt-2 text-violet-300">
			<a href="https://github.com/alxn3/NeRF-This" target="_blank" rel="noreferrer">GitHub</a>
		</h1>
		<h1 class="text-xl mt-2 text-violet-300">
			<a href="/NeRF_This.pdf" target="_blank" rel="noreferrer">Project Paper</a>
		</h1>
	</div>

	<div class="my-2">
		<h1 class="text-xl">The Research Problem</h1>
		<p>
			Neural Radiance Fields are a prominent way of synthesizing 3D scenes from image and video
			captures. However, for many casual users who capture NeRFs and other instances related to
			limitations with cameras, the initial input data to the NeRF may be low quality or inadequate
			to have high accumulation and confidence in consensus. As NeRFs tend to overfit on input data
			for better accumulation and density, not having enough input views to provide high-density
			accumulation can lead to artifacts such as floaters, clouds, and general noise where an
			element of the NeRF is supposed to be present.
		</p>
	</div>
	<img src="hardtech/pipeline.png" alt="" class="object-contain md:w-[90%] w-full mx-auto" />
	<div class="my-2 space-y-2">
		<h1 class="text-xl">Our Approach</h1>

		<p>
			Our approach samples accumulation and information from a prior NeRF with low accumulation and
			noise, perform noise detection and masking, in-paints the areas with a low prompt guidance
			diffusion model, and iteratively replaces and retrains the NeRF for gradual accumulation and
			consensus. Our method improves the accumulation density of NeRFs and can be an effective
			solution for casual users with low-quality input data.
		</p>
		<img src="hardtech/camerawalk.png" alt="" class="object-contain md:w-[80%] w-full mx-auto" />
		<p>
			In NeRFStudio, we implemented a camera walk method that stochastically moves a camera around
			the NeRF to generate new views according to the NeRF's normals at a certain point. This allows
			for more controlled and accurate camera placement.
		</p>
		<img src="hardtech/inpaint.png" alt="" class="object-contain md:w-[80%] w-full mx-auto" />
		<p>
			We then took the rendered image at each of the new view points, and used KMeans as well as the
			Laplacian Filter to create masks that held all areas with low resolution and low accumulation.
			These places would be then inpainted with a low prompt guidance diffusion model. We do this
			iteratively and while the NeRF is finetuning, so that we can gradually improve the NeRF's
			accumulation and consensus while maintaining the NeRF's original structure.
		</p>
		<img src="hardtech/progression.png" alt="" class="object-contain md:w-[80%] w-full mx-auto" />
	</div>
</div>
