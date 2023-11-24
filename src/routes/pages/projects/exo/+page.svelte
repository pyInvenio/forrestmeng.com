<script>
	import Icon from '@iconify/svelte';
</script>

<div class="relative mx-auto flex  lg:w-[50%] w-[95%] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">Lower-body Gravity Compensating Exoskeleton</h1>
			<h3 class="text-xl italic">Assistive Robotics La</h3>
			<div class="my-4">
				<img src="/hardtech/arlexo.jpg" alt="" class="h-1/2 mx-auto" />
				This exoskeleton is an active lower-body exoskeleton that is designed to help people with rehabilitation
				after a stroke. Grabbing information from sensors and motor encoders, the exoskeleton is able
				to calculate the position of the user's leg and ankle, and then use that information to compensate
				for gravity through varying the magnitudes of the force vectors applied to the user's harness.
				<br /><br />
				<h1>Predicting the Gait</h1>
				Gait is the pattern of movement of the body during walking. In order for the exoskeleton to be
				comfortable for the user, it must be able to predict the gait of the user and provide varying
				amounts of force depending on which state of a step and swing the user is in. I programmed a
				state machine to predict the gait of the user and a varying linear regression model to predict
				the heuristic of the user's gait.
				<br /><br />
				<img src="/hardtech/arlfsm1.png" alt="" class="mx-auto" /> Using the code I wrote, I was
				able to predict the gait of the user every time and was able to provide natural and
				comfortable.
				<img src="/hardtech/arlgraph.png" alt="" class=" mx-auto" />
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
