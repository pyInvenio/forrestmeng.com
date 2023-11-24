<script>
	import Icon from '@iconify/svelte';
</script>

<div class="relative mx-auto flex  lg:w-[50%] w-[95%] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">Latis</h1>
			<h3 class="text-xl italic">Securing Over-the-Air Updates for Industrial IoT through DLTs</h3>
			<h3>
				<a
					href="/pages/blog/latis"
					target="_blank"
					class=" flex flex-row align-baseline text-center"
					>I wrote a blog post on this<Icon icon="carbon:arrow-up-right" class="" /></a
				>
			</h3>
			<div class="my-4" >
				<img src="/hardtech/latispres.jpg" alt="" class="object-contain md:w-[75%] mx-auto" />
				<h1>The Problem</h1>
				Outdated firmware and operating systems in IoT devices pose a significant cybersecurity threat
			to OT manufacturers' large scale actuators. Edge cybersecurity solutions are still in their
			infancy, and current firmware update methods are often unscalable, leading to devices not
			being updated for over 15 years. <br /><br /> Our research aims to address this issue through decentralization,
			ensuring manufacturers' systems are up-to-date and patchable by trusted entities. This approach
			eliminates attack surfaces without sacrificing connectivity or efficiency, making it a viable solution
			for securing large scale actuator IoT devices. Such devices often contain PLCs, RTUs, and computers
			that could be hijacked as part of botnets, posing financial losses and safety risks for operations
			and human workers.
			<br><br>
			<h1>How My Team is Solving It</h1>
			<img
			src="/hardtech/latissystemdiagram.png"
			alt=""
			class="object-contain md:w-[90%] mx-auto"
		/>
			Using DLTs and a consensus-based approach, we built a proof of concept of an over the air
			secure firmware update system. We used Hedera's hashgraph system for a low-cost method of
			ensuring that the integrity of the file sent from the OEM is upheld all the way to the machine
			itself, while still providing the manufacturer control over the process. No middleman is able
			to really interfere with the updating process. DLTs also are great for this purpose because of
			the many third-party actors a manufacturer has to interact with. We also used Estuary's IPFS
			client for FileCoin to store the firmware files in a decentralized manner.
			<img
			src="/hardtech/latisoemledger.jpg"
			alt=""
			class="object-contain md:w-[90%] mx-auto"
		/>
		Both of the OEM and manufacturer portals are created using Sveltekit, for locally run web
			applications. However, access to the actual application is restricted behind a hardware key
			access, where an individual has to connect their Ledger to actually log into the system.
			Physical security still is the best security in some cases.
			<img
			src="/hardtech/latisoemscreen.jpg"
			alt=""
			class="object-contain md:w-[90%] mx-auto"
		/>
		The OEM Screen has a component where they can upload a file to Filecoin through Estuary. They
			can also see all the current updates they have that are uploaded, and can notify the
			manufacturer of a new update. All of these transactions are done through smart contracts, so
			that the OEM can't just upload a malicious file and send it to the manufacturer, and no one
			can tamper with the file or notifications once it's uploaded. We used OpenZepplin for
			permission security.
			<img
			src="/hardtech/latismanuscreen.jpg"
			alt=""
			class="object-contain md:w-[90%] mx-auto"
		/>
		Finally, the manufacturer can see all the updates that are available to them, and can choose
			which ones to send to which machines. Once sent to the machine (Raspberry Pi), the machine
			will download the file from Filecoin and verify the integrity of the file using an AES 256
			hash. If the file is verified, the machine will update the firmware through a PXEBoot process.
			If the file is not verified, the machine will not update the firmware.
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
