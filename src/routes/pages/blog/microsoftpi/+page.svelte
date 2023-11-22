<script>
	import Icon from '@iconify/svelte';
	let codeSnippet1 = `
    void __cdecl ___security_init_cookie(void) {
      if ((DAT_10438008 == 0xbb40e64e) || ((DAT_10438008 & 0xffff0000) == 0)) {
        DAT_10438008 = ___get_entropy();
        if (DAT_10438008 == 0xbb40e64e) {
          DAT_10438008 = 0xbb40e64f;
        }
        else if ((DAT_10438008 & 0xffff0000) == 0) {
          DAT_10438008 = DAT_10438008 | (DAT_10438008 | 0x4711) << 0x10;
        }
      }
      DAT_10438004 = ~DAT_10438008;
      return;
    }
  `;
	let codeSnippet2 = `
  uint ___get_entropy(void)

{
  DWORD DVar1;
  LARGE_INTEGER local_18;
  _FILETIME local_10;
  uint local_8;
  
  local_10.dwLowDateTime = 0;
  local_10.dwHighDateTime = 0;
  GetSystemTimeAsFileTime(&local_10);
  local_8 = local_10.dwHighDateTime ^ local_10.dwLowDateTime;
  DVar1 = GetCurrentThreadId();
  local_8 = local_8 ^ DVar1;
  DVar1 = GetCurrentProcessId();
  local_8 = local_8 ^ DVar1;
  QueryPerformanceCounter(&local_18);
  return local_18.s.HighPart ^ local_18.s.LowPart ^ local_8 ^ (uint)&local_8;
}`;
</script>

<div class="relative mx-auto flex  lg:w-[50%] w-[95%] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">0xbb40e64e</h1>
			<h3 class="text-xl italic">microsoft’s cookie made of pi</h3>
			<div class="my-4">
				<img src="/pi1.png" alt="" />
				Buffer overflow attacks are some of the most simple attacks to perform on low-level code and
				drivers in operating systems and programs. Once an attacker finds a vulnerability inside a program
				and a way to deliver malicious input to the driver, they can copy more data than the buffer can
				accommodate (a buffer is an allocated memory block used to store data, such as incoming data
				from another program or input for processing). This overflow of memory causes a memory leak,
				which could overwrite critical data in adjacent memory blocks. By specifically constructing an
				overflow attack, attackers can control the flow of the program and execute malicious code, such
				as using elevated privileges to install malware or attack the kernel.

				<br /><br />To prevent buffer overflow attacks and mark buffer overrun exceptions, many
				drivers and executables on Windows machines have a method called
				__security_init_cookie(void), a standard method for generating a global security cookie for
				/GS (Buffer Security Check) compiled C code at runtime if there isn’t one already by
				default. This often happens at the entry point of the driver; usually, the entry point is
				explicitly set and therefore needs a new cookie for the stack when the thread is executed
				since the cookie is initially set to the default value. To check to see if there is any
				buffer overflow or other program errors that happened along the stack (the fundamental data
				structure computers use to manage the execution of programs, in a LIFO format), the program
				checks the generated cookie value with a trusted sentinel value stored elsewhere. If there
				is a difference, this means that along the stack somewhere, there probably was some
				corruption and buffer overflow, and the program can take appropriate measures to mitigate
				the error.
				<br /><br />To effectively perform an attack, therefore, attackers would need to know the
				cookie value (which is hidden in memory) to obfuscate their presence and activity within a
				program’s stack. To make this harder, many programs add entropy to an initial cookie value.
				Entropy is the measure of randomness and unpredictability of the cookie, and adding entropy
				is more or less passing the value through an algorithm where the cookie is modified with
				external random factors, such as system time and tick count.
				<br /><br />This default value, for many Windows drivers and executables, is 0xbb40e64e,
				which is the hex representation of 3141592654. You may notice this as the first 10 digits of
				pi in decimal form. This is known as a “Nothing-up-my-sleeve” number, which defines numbers
				that are above suspicion in hidden properties, i.e. there’s no actual purpose for the value
				to exist rather than be an initial seed. Theoretically, the entropy function
				___get_entropy(void) should provide enough randomness that the initial seed doesn’t matter.

				<br /><br />Take for instance the disassembled code in one of Nvidia’s drivers on Windows
				11, nvcuda.dll (full trace of this driver coming sometime this summer lol):

				<br /><br />Here is the disassembled entry method which generates a security cookie and
				saves it to a designated register.

				<br /><br />
				<pre>
					<code>{@html codeSnippet1}</code>
				</pre>
				It calls __get_entropy() to get a randomized seed.
				<br /><br />
				<pre>
					<code>{@html codeSnippet2}</code>
				</pre>
				This relies on the system time (64 bits), which is stored in dwLowDateTime and dwHighDateTime,
				each of which is 32 bits. This is needed to support 32-bit systems by splitting 64-bit data into
				halves. The entropy also relies on thread ID (32 bits), process ID (32 bits), and the value of
				the performance counter (64 bits probably). By XORing these values, there is a possibility of
				2^(64+32+32+64) = 2^192 outcomes, which is an extremely large number and would be almost impossible
				to 1) have any internal conflicts within the computer system itself and 2) have a bad actor predict
				the cookie for buffer overflow attacks.

				<br /><br />However, it is possible to reduce the effective entropy (effective # of possible
				random values) by calculating certain aspects of the entropy, given that we know the initial
				seed of 0xbb40e64e.

				<br /><br />Paper:
				<a href="http://uninformed.org/index.cgi?v=7&a=2">http://uninformed.org/index.cgi?v=7&a=2</a
				>
				<br /><br />In the paper “Reducing the Effective Entropy of GS Cookies” published by Skape
				of Uninformed, the entropy sources analyzed in their method are the current system time,
				process identifier, thread identifier, tick count, and performance counter, very similar to
				the entropy from the nvcuda.dll example. Given local access, an attacker can reliably
				calculate all of the entropy values save the lower 17 bits of the performance counter (it is
				harder, but still possible, with remote access).

				<br /><br />System time is the time that the cookie is generated. This could be collected
				within the thread scheduler period, which on default Windows machines (even today) is around
				15.6ms, an exceedingly long time frame for which a program can be run on the CPU. Using the
				NtQuerySystemInformation API, even with a non-privileged user, the malicious program can get
				all of the information of processes and their creation time, which is often the same as
				system time. Therefore, one of the sources of entropy can be retrieved fairly easily.

				<br /><br />PID and Thread ID sources are even easier, as they can be retrieved with the
				same API. They are also known to have the two higher-order bytes to be basically always 0s.

				<br /><br />Tick count is another source of entropy that is also related to time, and can be
				calculated accurately by the difference between the thread creation time with the boot time,
				divided by 10000 to convert the intervals to 1 ms ticks, and then offsetting by 0x4e ticks,
				which is a constant scaling factor in Windows systems.

				<br /><br />The Performance Counter (PC) is the source that really provides a challenge to
				calculating the entropy since it describes the number of clock cycles that have been
				executed. This can be estimated using the APIs QueryPerformanceCounter (returns the current
				PC value) and QueryPerformanceFrequency (amt that PC would change in one second). Using an
				equation to estimate PC from this information, with experiment-based scaling, it is possible
				to calculate everything but the lower 17 bits of the 64-bit PC value (the lower 17 will
				fluctuate due to the nature of the API and estimation).

				<br /><br />Through experimental results, Skape showed that most of the entropy sources
				could be predicted reliably, aside from the lower 32 bits of the PC, with the lower 17 bits
				having an accuracy of 50% (maximum effective entropy). This seems pretty secure; 17 bits
				have a probability of being predicted correctly once in 2^17 times.

				<img src="/pi2.png" alt="" />
				Paper:
				<a href="https://j00ru.vexillium.org/papers/2011/windows_kernel_gs_cookies_subverted.pdf"
					>https://j00ru.vexillium.org/papers/2011/windows_kernel_gs_cookies_subverted.pdf</a
				>
				<br /><br />However, in a slightly more recent paper, “Exploiting the otherwise
				non-exploitable,” a method was shown to increase the predictability of PC.

				<br /><br />Through experimental surveying, the authors of the paper noticed that only two
				values for PC are observed typically: 156001 and 156250. These can be observed in 1/64 s,
				providing a very low and weak entropy level. Using this weakness, the authors then performed
				experiments on different types of drivers. With Boot load drivers, they found that the PC
				was almost impossible to predict accurately still due to random hardware delays that can
				affect the boot time; only by having particular knowledge of the local system can an
				attacker accurately predict the PC value to a larger number of bits. With process-relative
				drivers (drivers that users can trigger manually), however, by getting the tick information
				and a kernel-level CreateTime structure, it is possible to increase the probability of
				estimating a cookie’s bits significantly, up to the LSB. For public drivers, also using the
				CreateTime structure, the authors were able to get similar GS cookie prediction
				probabilities.

				<img src="/pi3.png" alt="" />From observing current drivers, on a recently updated Windows
				11 machine, it seems that this cookie and entropy creation method has not changed.

				<br /><br />This initial seed cookie has been noticed very early on, since 2007 in forum
				posts where individuals found ways to bypass stack protection:
				<a href="http://sf-freedom.blogspot.com/2007/03/ms06-040-reloaded-easy-way-to-bypass.html"
					>http://sf-freedom.blogspot.com/2007/03/ms06-040-reloaded-easy-way-to-bypass.html</a
				>
				<br /><br />Here is a more recent PE (portable executable) executable backdoor that also
				overwrites the same cookie value to redirect code direction:

				<br /><br /><a
					href="https://github.com/blackc03r/OSCP-Cheatsheets/blob/master/offensive-security/code-injection-process-injection/backdooring-a-pe-executable-with-shellcode.md"
					>https://github.com/blackc03r/OSCP-Cheatsheets/blob/master/offensive-security/code-injection-process-injection/backdooring-a-pe-executable-with-shellcode.md</a
				>
				<br /><br />The static cookie 0xbb40e64e and the methods of entropy sourcing are known
				vulnerabilities that can lead to the most fundamental attack on low-level drivers and
				executables. However, many companies, like Microsoft, overlook this fact and don’t update
				the entropy algorithm or the seeding method. This may be due to the fact that it is hard for
				local access to the machine to get all of the information needed (almost air-gapped) for
				entropy calculation. It is possible for remote access but requires significantly more work.
				Additionally, the PC value is hard to calculate effectively; more recent research is not
				publicly available, so I’m not really sure what alphas malicious actors use to bypass the
				hardware instabilities. Finally, there is more than one check on the cookie and stack
				integrity now, with other algorithms and APIs the program uses to catch untrusted or
				malicious behavior.

				<br /><br />This is an effective method of creating a cookie with suitable entropy for many
				devices, and with the number of actual zero-days that are still unpatched, I’d imagine
				attackers have easier ways of entering their target’s system.
			</div>
		</div>
	</div>
</div>

<style type="scss">
	img {
		@apply mx-auto max-h-64 my-4;
	}
</style>
