<script>
	let links = {
		CompCert: 'https://github.com/AbsInt/CompCert',
		aIT: 'https://www.absint.com/ait/',
		'System Bus Radio': 'https://github.com/fulldecent/system-bus-radio',
		Pingfs: 'https://github.com/yarrick/pingfs',
		OSDev: 'https://wiki.osdev.org/Main_Page',
		'gr-tempest':
			'https://events.gnuradio.org/event/8/contributions/226/attachments/36/51/main.pdf',
		PacketStream: 'https://packetstream.io/',
		XMRig: 'https://github.com/xmrig/xmrig',
		PIR: 'https://crypto.stanford.edu/pir-library/',
		'TEE Rollups':
			'https://medium.com/@dsl_uiuc/tee-rollups-fixing-access-patterns-in-tee-based-smart-contracts-with-off-chain-computing-b2f3acfe335f',
		'TEE Offchain': 'https://github.com/initc3/tee-offchain',
		'Volumetric raymarching':
			'https://blog.maximeheckel.com/posts/real-time-cloudscapes-with-volumetric-raymarching/',
		'Lib Trading': 'https://github.com/libtrading/libtrading',
		'Raspberry NOAA': 'https://github.com/jekhokie/raspberry-noaa-v2/blob/master/README.md',
		'Callback Heaven':
			'https://bessiambre.medium.com/continuation-passing-style-patterns-for-javascript-5528449d3070#:~:text=Continuation%20Passing%20Style%20basically%20means,the%20last%20parameter%20of%20functions'
	};
</script>

<div class="relative mx-auto flex w-[min(86rem,95%)] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-6xl mb-4">stuff I came across that I think are cool</h1>
			{#each Object.entries(links) as [name, link]} 
                <li><a href={link} target="_blank">{name}</a></li>
            {/each}
		</div>
	</div>
</div>
