<div class="w-full h-full flex flex-col">
	<div class="w-full">
		<h1 class="text-4xl">Cube Rotation with Optical Flow</h1>
		<h1 class="text-xl mt-2">Project a perspective accurate cube in a video stream.</h1>
	</div>
	<h1>
		<a
			href="https://github.com/pyInvenio/computervisiontj/blob/main/Project7/Project7/l9.cpp"
			target="_blank"
			rel="noreferrer"
			class="font-medium text-2xl text-primary">Github File</a
		>
		<br />
		<a
			href="https://github.com/pyInvenio/computervisiontj"
			target="_blank"
			rel="noreferrer"
			class="font-medium text-2xl text-violet-300">Overall Github Repo</a
		>
	</h1>
	<div class="w-full">
		<iframe
			src="https://drive.google.com/file/d/1Kz7j8Hz86pDocuBlLz2gkt1grGFbc4Nz/preview"
			frameborder="0"
			allowfullscreen
			title="SpaceSight"
			class="w-full aspect-video md:h-96 h-64 my-2"
		/>
	</div>
	<div class="my-2 space-y-2">
		<h1 class="text-xl">How I Built It</h1>
		<p>
			Given a video stream, I used OpenCV to calibrate the camera using the chessboard, drawing the
			chessboard corners and orientation each frame. Due to the fact there is some distortion as
			well as there is occlusion of the chessboard, I used a 6 pyramid level optical flow algorithm
			to track the corners of the chessboard. I then used the optical flow to calculate the rotation
			of the chessboard and projected a cube onto the chessboard using a PnP solver.
			<br /><br />I learned a lot about camera calibration, optical flow, and PnP solvers through
			this project, especially how we can use historical data to fill in missing data in the current
			frame.
		</p>
	</div>
</div>
