<div class="w-full h-full flex flex-col">
	<div class="w-full">
		<h1 class="text-4xl">QuizzAR</h1>
		<h1 class="text-xl mt-2">
			Making financial literacy fun and accessible for kids using LEAP Motion and Unity.
			<br />
			Won 1st place Education Track at HackDuke.
		</h1>
	</div>
	<h1>
		<a
			href="https://github.com/alxn3/HackDuke2021"
			target="_blank"
			rel="noreferrer"
			class="font-medium text-2xl text-primary">Github</a
		>
	</h1>
	<div class="w-full">
		<h1 class="text-2xl mt-2">Demo Video:</h1>

		<iframe
			src="https://www.youtube.com/embed/r9CR9aCKWP8"
			frameborder="0"
			allowfullscreen
			title="SpaceSight"
			class="w-full aspect-video md:h-96 h-64 my-2"
		/>
	</div>
	<div class="my-2 space-y-2">
		<h1 class="text-xl">Project Summary</h1>
		<p>
			Finance QuizzAR is an interactive and immersive studying experience, capable of bolstering
			productivity in a fun and engaging manner. Using a wearable LEAP Motion Sensor, the student
			can choose the number of questions to be quizzed on, ranging from five to infinite. The
			question is then shown to the student with large targets surrounding it with the answer
			choices. The LEAP Sensor tracks hand movement and interacts with environment objects such as a
			ball, which is thrown towards targets with the answer choices presented on them. Targets flash
			red and green depending on the correct choice. A score is counted, and the student gets a
			round of applause at the end of the study session.
		</p>
		<h1>How I Built It</h1>
		<p class="text-xl">
			To use the LEAP Motion Sensor, we used the Ultraleap plugin for Unity, which allowed us to
			track the hand movements and position through LEAP Motion Sensor's LIDAR technology extremely
			accurately. We then created scenes that included collision boxes around objects and a physics
			engine through Unity's rigid-body component. To code the script for respawning, hand gestures,
			and question management, we used C# and created different classes for different objects, such
			as the Board and Ball. We used different scenes to also improve UI and UX design.
		</p>
	</div>
</div>
