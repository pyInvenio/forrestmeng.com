<div class="w-full h-full flex flex-col">
	<div class="w-full">
		<h1 class="text-4xl">Coin Detection</h1>
		<h1 class="text-xl mt-2">
			Using edge detection, non-max suppression, hough transforms from scratch
		</h1>
	</div>
	<h1>
		<a
			href="https://github.com/pyInvenio/computervisiontj"
			target="_blank"
			rel="noreferrer"
			class="font-medium text-2xl text-violet-300">Github Repo</a
		>
	</h1>
	<img src="softtech/cvcoinresult.jpg" alt="" class="h-1/2 mx-auto" />
	<div class="my-2 space-y-2">
		<h1 class="text-xl">How I Built It</h1>
		<p>
			I coded this project from scratch just using native C++ libraries (no OpenCV). There are
			several parts to this project, including:

			<li>Canny Edge Detection</li>
			<li>Non-Max Suppression</li>
			<li>Hough Transform</li>
			<li>Circle Detection</li>

			<br />
			For Canny Edge Detection, I took in a PPM image of the coins, converted it to grayscale, and applied
			Gaussian filters to smooth the image from noise. Using the Sobel Operator, I could then detect
			contrasting changes in the image signal, which usually meant an edge. However, there is still a
			lot of noise in the image, so I then used non-max suppression to remove the noise. Finally, I used
			hysteresis to remove the weak edges. Here is an example of my Canny Edge Detection output given
			an image:
		</p>
		<div class="flex mx-auto">
			<img src="softtech/shippicture.jpg" alt="" class="p-2 object-contain w-1/2" />
			<img src="softtech/cannyedge.png" alt="" class="p-2 w-1/2 object-contain" />
		</div>
		<p>
			<br />
			I then needed to detect the circles in the image. I used the Hough Transform to detect the circles
			by drawing various radius circles at each pixel of an edge in the image. By accumulating the circles,
			I could detect which pixels represent the centroids of the circles, since they would have the highest
			intensity of overlap. I could then draw the circles on the image and detect the coins. Here is
			an example of the circles I detected in red:
		</p>
		<div class="flex mx-auto">
			<img src="softtech/cannyedgecoins.png" alt="" class="p-2 object-contain w-1/2" />
			<img src="softtech/cannyedgecoinsoutline.png" alt="" class="p-2 w-1/2 object-contain" />
		</div>
		<p>
			Finally, by using a varying heuristic as well as the RGB value of the centroid pixel, I could
			then detect the different types of coins in the image and calculate the value of the coins.
			This is a robust way to detect coins in an image, even if there are overlaps and different
			sizes of coins. The result is shown at the top of this page.
		</p>
	</div>
</div>
