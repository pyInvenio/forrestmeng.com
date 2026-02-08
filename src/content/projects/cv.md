---
title: Computer Vision Projects
subtitle: Canny Edge Detection & Cube rotation
slug: cv
links:
  - label: Github
    url: https://github.com/pyInvenio/computervisiontj
description: Canny Edge Detection & Cube rotation
---

## Canny Edge Detection

![](/softtech/cvcoinresult.jpg)

I coded this project from scratch just using native C++ libraries (no OpenCV). There are several parts to this project, including:

- Canny Edge Detection
- Non-Max Suppression
- Hough Transform
- Circle Detection

For Canny Edge Detection, I took in a PPM image of the coins, converted it to grayscale, and applied Gaussian filters to smooth the image from noise. Using the Sobel Operator, I could then detect contrasting changes in the image signal, which usually meant an edge. However, there is still a lot of noise in the image, so I then used non-max suppression to remove the noise. Finally, I used hysteresis to remove the weak edges. Here is an example of my Canny Edge Detection output given an image:

<div class="flex mx-auto flex-col md:flex-row">
	<img src="/softtech/shippicture.jpg" alt="" class="p-2 object-contain" />
	<img src="/softtech/cannyedge.png" alt="" class="p-2 object-contain" />
</div>

I then needed to detect the circles in the image. I used the Hough Transform to detect the circles by drawing various radius circles at each pixel of an edge in the image. By accumulating the circles, I could detect which pixels represent the centroids of the circles, since they would have the highest intensity of overlap. I could then draw the circles on the image and detect the coins. Here is an example of the circles I detected in red:

<div class="flex mx-auto flex-col md:flex-row">
	<img src="/softtech/cannyedgecoins.png" alt="" class="p-2 object-contain" />
	<img src="/softtech/cannyedgecoinsoutline.png" alt="" class="p-2 object-contain" />
</div>

Finally, by using a varying heuristic as well as the RGB value of the centroid pixel, I could then detect the different types of coins in the image and calculate the value of the coins. This is a robust way to detect coins in an image, even if there are overlaps and different sizes of coins. The result is shown at the top of this page.

## Cube

[Github File](https://github.com/pyInvenio/computervisiontj/blob/main/Project7/Project7/l9.cpp)

<iframe
	src="https://drive.google.com/file/d/1Kz7j8Hz86pDocuBlLz2gkt1grGFbc4Nz/preview"
	frameborder="0"
	allowfullscreen
	title="Cube"
	class="w-full aspect-video md:h-96 h-64 my-2"
/>

Given a video stream, I used OpenCV to calibrate the camera using the chessboard, drawing the chessboard corners and orientation each frame. Due to the fact there is some distortion as well as there is occlusion of the chessboard, I used a 6 pyramid level optical flow algorithm to track the corners of the chessboard. I then used the optical flow to calculate the rotation of the chessboard and projected a cube onto the chessboard using a PnP solver.

I learned a lot about camera calibration, optical flow, and PnP solvers through this project, especially how we can use historical data to fill in missing data in the current frame.
