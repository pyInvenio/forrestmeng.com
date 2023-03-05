<div class="w-full h-full flex flex-col">
	<div class="w-full">
		<h1 class="text-4xl">Assistive Robotics Lab</h1>
		<h1 class="text-xl mt-2">Lower-body Gravity Compensating Exoskeleton</h1>
	</div>

    <img src="hardtech/arlexo.jpg" alt="" class="h-1/2 mx-auto" />
	<div class="my-2 space-y-2">
		<h1 class="text-xl">The Project</h1>
		<p>
			This exoskeleton is an active lower-body exoskeleton that is designed to help people with
            rehabilitation after a stroke. Grabbing information from sensors and motor encoders,
            the exoskeleton is able to calculate the position of the user's leg and ankle, and
            then use that information to compensate for gravity through varying the magnitudes
            of the force vectors applied to the user's harness.
		</p>
        <h1 class="text-xl">Predicting the Gait</h1>
        <p>
            Gait is the pattern of movement of the body during walking. In order for the exoskeleton to be comfortable
            for the user, it must be able to predict the gait of the user and provide varying amounts of force depending on
            which state of a step and swing the user is in. I programmed a state machine to predict the gait of the user and 
            a varying linear regression model to predict the heuristic of the user's gait.
        </p>
        <img src="hardtech/arlfsm1.png" alt="" class="w-full mx-auto" />
        <p>
            Using the code I wrote, I was able to predict the gait of the user every time and was able to provide natural and comfortable
            gravity compensating forces to the user while walking. 
        </p>
        <img src="hardtech/arlgraph.png" alt="" class="w-full mx-auto" />
		
	</div>
</div>
