<script>
	import Icon from '@iconify/svelte';
</script>

<div class="relative mx-auto flex  lg:w-[50%] w-[95%] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">Haptic Tactics</h1>
			<h3 class="text-xl italic">Haptic VR Proxy for Aerospace Drilling Training Applications</h3>
			<div class="my-4">
				<h1 class="">Demo Video:</h1>

				<iframe
					src="https://drive.google.com/file/d/1asMr7pa4bzP_mhgGvcjyQ_a4x2gs5-lD/preview"
					frameborder="0"
					allowfullscreen
					title="Haptic Tactics"
					class="w-full aspect-video md:h-96 h-64 my-2"
				/>
				<br /><br />
				<h1>The Problem</h1>
				Boeing drills millions of holes every day, many of which are still done by hand. It's an intensive
				task that requires optimal force vectors for different materials, proper lubrication, and correct
				drilling angles and RPM. Each hole also requires a pilot hole to guide the drillbit into position.
				Accuracy is crucial, as even a tiny defect can cause catastrophic failure, costing the company
				tens of thousands of dollars. Mechanics are also at risk of repetitive stress injuries.<br
				/> <br /> To address these issues, I led a team to develop a haptic VR training system for
				aerospace drilling. This technology has been shown to improve training effectiveness in
				other fields, such as bone surgery and construction crane operation. Mechanics can now train
				in a safe virtual environment and feel the forces and vibrations of drilling, as well as
				receive feedback from the drillbit.
				<br /><br />
				<h1>The Drill</h1>
				<div class="flex mx-auto">
					<img src="/hardtech/hapticdrillcad.jpg" alt="" class="p-2 object-contain" />
					<img src="/hardtech/hapticdrill.jpg" alt="" class="p-2" />
				</div>
				The drill proxy was modeled in SolidWorks and printed in PLA. We used a rack and pinion to transform
				the rotational torque provided by the BLDC into linear force feedback. The handle of the drill
				is hollow, allowing us to insert our PCB boards, wires, and vibromotor.
				<img src="/hardtech/hapticutaway.jpg" class="object-contain mx-auto" alt="" />A Teensy 4.0
				microcontroller was used as a middleman between the host computer and the other motor
				controllers. It received commands from the host computer through UART and relayed the force
				feedback commands to the BLDC motor controller and the vibration commands to the vibromotor.
				It also sent the button press and toggle switch states to the host computer. I controlled
				the BLDC's resistance through modifying the SimpleFOC library and current-based PID control
				according to the value sent by the host computer, providing a customizable linear resistance
				which represented different drilling materials. We also attached two fans to the drill to
				provide cooling for the BLDC. Below is an image of the drill circuit during testing.
				<img src="/hardtech/hapticcircuit.jpg" class="object-contain mx-auto" alt="" />Above, you
				can see our VR demo in action at the CHCI symposium (where we won second place). To simulate
				the drilling process, we used Unity and the SteamVR plugin. We used the HTC Vive system for
				tracking the proxy and the "drilling target." The proxy is represented by a 3D model of a
				power drill in Unity, which acts as a raycast controller and a visual representation of the
				drill.
				<br />
				<br />
				The drill target is a procedurally generated multi-layered mesh. I programmed the material so
				that when the user drills this target, a hole is created with convincing effects that the user
				is actually drilling. Additionally, the drill proxy would engage its haptic feedback according
				to which layer (material) the user was drilling. Audio feedback was also provided to the user
				to simulate the drilling sound. Below is a picture of my development on the Unity environment.
				<img src="/hardtech/hapticunityscreen.jpg" alt="" class="object-contain  mx-auto" />
				<h1>Results</h1>
				<img src="/hardtech/hapticdemo2.png" alt="" class="object-contain mx-auto" />My team
				finished the project and presented it at the VT CHCI symposium, where we won second place
				while being the only underclassmen team. We also presented to the Chief Strategy Officer of
				Boeing (Mark Allen) and the Chief Technology Officer of CAT (Karl Weiss). With initial
				testing, we had an 80% success in drilling sensation satisfaction with haptic illusion.
				<div class="flex flex-col md:flex-row mx-auto space-y-2 md:space-y-0">
					<img
						src="/hardtech/hapticmarkallen.JPG"
						alt=""
						class="object-contain mx-auto"
					/>
					<img
						src="/hardtech/haptickarlweiss.JPG"
						alt=""
						class="object-contain mx-auto"
					/>
				</div>
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
