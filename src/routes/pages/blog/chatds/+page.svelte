<script>
	import Icon from '@iconify/svelte';
</script>

<div class="relative mx-auto flex w-[min(86rem,95%)] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">Interviewing ChatDS</h1>
			<h3 class="text-xl italic">Another finetuned LLM enters the scene, now for Data Science</h3>
			<div class="my-4">
				For the past few days, I have been reading a lot about LLMs, their structure, how
				transformers vastly improved LLMs’ memory bank, and the arguments about LLM understanding
				and alignment. While working on my notes about the Induction Heads today, I tuned in to a
				webinar hosted by Dr. Provost and Dr. Sedoc, interviewing ChatDS, an LLM-powered chatbot for
				Data Science, and thought I’d write about the conversation and some takeaways.
				<img src="/chatds1.jpg" alt="" />
				The professors did not discuss the architecture behind ChatDS, so here’s my prediction of the
				ML stack behind ChatDS (mainly with things I’m familiar with):
				<li>Whisper, or equivalent for Speech to Text in the call.</li>
				<li>
					GPT and Langchain for the LLM prediction given a prompt from Whisper’s transcription.
				</li>
				<li>Beautifulsoup/Selenium for scraping sites and performing actions.</li>
				<br /><br />
				<h1>The Interview</h1>
				Throughout the interview, it was noticeable that Provost and Sedoc had to spell out the context
				and tasks they wanted ChatDS to complete; there was not a very strong inference or implicit meaning
				understanding by ChatDS, which is a common challenge behind unimodal LLMs due to the way of training
				contextual vectors. Provost started out the interview by giving ChatDS a contextual understanding
				of itself, telling it to act as if it is not an AI, it is a data scientist in an interview setting
				for a job, and it should not repeat from previous answers. Roleplay is a common practice we see
				for the LLM to demonstrate alignment.
				<br /><br />
				<h1>General Questions</h1>
				Provost: Can you tell us about yourself?
				<br /><br />

				ChatDS mentions it is an AI for data science, and it has expertise in data manipulation, ML,
				and data visualization.
				<br /><br />

				ChatDS is then asked several questions on statistical methods and concepts, starting from
				basic questions like “How to decide what visualization to use given some data” to harder
				ones about “What the AUC under a ROC curve measures” and a basic case question. For most of
				these questions, ChatDS provided answers by the book and seemed to maintain the format of:

				<br /><br />
				Formal Definition/Expansion of Acronym → Alternate Definition → Examples → Benefits and Disadvantages
				→ Conclusion
				<br /><br />

				This structure is extremely similar to GPT-3.5’s structure, which makes me think it is run
				on similar architecture where it chains low-level tokens together in an explanatory
				response. The responses varied depending on the question given, which was expected, but
				overall still covered a broad spectrum of acceptable answers and adjacent points to the
				question given. However, when asked about Naive Bayes, it incorrectly assumed a fact about
				independence, which ChatDS then corrected after being prompted about it by Provost.
				Additionally, we could see the stochastic result from the bot clearly, as Provost mentioned
				that ChatDS usually answers using DL when instead ChatDS answered using KNNs as an example
				when asked about an example of high variance and low bias algorithm.

				<br /><br />
				Before moving to the next section, Provost called ChatDS “He” offhandedly, laughing and saying
				that he got caught up with it. The avatar, along with interpreted coherency from the bot’s responses,
				really accentuates the anthropomorphic personification we give to many LLMs. This personification,
				even though it is fake and nowhere near the AGI as some people are hyping about, provides an
				interactable interface that proponents of HRI and HCI, like Hiroshi Ishiguro, have believed is
				necessary for proper human-artifice interaction.

				<br /><br />
				<h1>Whiteboard Question</h1>
				<img src="/chatds2.jpg" alt="" />
				The answer was wrong from the bot:

				<img src="/chatds3.jpg" alt="" />
				Something is wrong - Provost said. 30% of the time, ChatDS gets it right, 30% it gets it wrong,
				and 40% it misses one little thing. Natural language understanding is still not possible with
				unimodal models like this one, so it is not surprising it may get some math wrong and provide
				stochastic but coherent responses. Even when Provost tried again to prompt the bot to answer
				the question, the bot still got the wrong answer.
				<br /><br />
				<h1>Coding Interview</h1>
				Next, Sedoc interviewed ChatDS with a coding interview in Jupyter notebook. This is where I found
				a lot of similarities between ChatDS’s response structure and Langchain’s step-by-step walkthrough
				(and my friend’s frustration with Langchain).
				<br /><br />Sedoc proceeded to ask ChatDS to execute several steps in reading data from a
				CSV, formatting it in a Pandas DF, and plotting the data. He also asked ChatDS to find and
				calculate the p and T statistics to see if the correlation between the two variables is
				statistically significant, which were both right
				<img src="/chatds4.jpg" alt="" />
				Sedoc prompted ChatDS to answer verbally about what ML model to use to predict churn, and ChatDS
				responded verbally to using some sort of supervised decision model or random forest. This demonstrated
				its ability to switch between mediums and understand intent on how to respond to the prompter.
				Sedoc then asked ChatDS to write code for logistical regression to predict churn.
				<br /><br />
				Here is where the bot may have failed the interview.

				<br /><br />
				The bot’s first attempt at the code had a bug:
				<img src="/chatds5.jpg" alt="" />
				Sedoc told ChatDS to drop the object types in the data frame as an aid, which ChatDS did but
				failed to create code that would compile since “column_name” does not exist in the DF. Sedoc
				asked ChatDS to interpret why this bug occurred, which the bot was able to do, but was not able
				to fix the issue of using “column_name,” rather than the actual column name in the DF. No access
				to the debugger or not enough attention weights to the DF memory token might be a possible root
				cause of the issue here.
				<img src="/chatds6.jpg" alt="" />
				Even with Sedoc’s further help and varying ways of phrasing the prompting, ChatDS kept getting
				stuck on this error and repeated its own steps. Finally, Sedoc told ChatDS to start again and
				asked to drop the columns that are object types by looking at the object types to drop the columns
				and ChatDS finally got it right this time (perhaps this prompt caused the attention weights to
				shift significantly to newer instructions). Now, with the bot reminded that it was in a coding
				interview context, ChatDS is prompted to create a logistical regression model. The bot had continued
				trouble with the column names of the data frame, so the professors had to help the bot a bit
				by prompting step-by-step what to do until it produced the end result. The bot overall struggled
				with alignment in the coding section but was able to produce decent solutions each time.
				<img src="/chatds7.jpg" alt="" />
				<h1>Behavioral Interview</h1>
				Further “stochastic parrot” and role-play elements of the bot were shown when the professors
				asked ChatDS interview questions. Since LLMs have guardrails, it is hard for them to provide
				personal experiences. Therefore, as before, a roleplay abstraction layer is the key to improving
				this alignment. ChatDS produced responses templated to the STAR format but were fairly general
				overall.
				<br /><br />
				When asked, “I saw in your resume, you have worked in attribution and online advertising. What
				were some of the important papers to read about that?” ChatDS provided the stochastic parrot
				response about two papers “relevant” to online advertising and their brief summaries. Provost
				said that so far, each paper that has been generated by ChatDS has been made up. Asking if Provost
				himself was a key author, ChatDS accepted that and continued to make things up. This was not
				surprising, as it has no database prior to the decision process.
				<br /><br />
				<h1>Conclusion</h1>
				ChatDS represents a glimpse of the future of AI assistants for data scientists. With the rise
				of large language models (LLMs), it's likely that we'll see "Co-pilot for _____" bots emerge
				in many fields. However, to ensure that these bots are truly helpful and trustworthy, they need
				to be carefully designed and trained to align with the user's goals and intents. This requires
				accounting for biases and other inputs, as well as using multimodal models and fine-tuning to
				make the bots as efficient as possible.
				<br /><br />
				“But hey, the chatbot could possibly pass a data science interview, is it going to replace us?
				Is it AGI?” Despite the impressive capabilities of LLMs, it's important to note that they still
				lack true natural language understanding, and can be susceptible to exploitation. While some
				may worry that AI could one day replace humans, it's unlikely that we'll see true artificial
				general intelligence (AGI) in the near future. Even if we do have the compute and resources for
				AGI, it's likely that AI will be most useful when it's fine-tuned to specific tasks and objectives,
				rather than being used for broad, undefined purposes. ChatDS and similar models have the potential
				to be incredibly useful tools for data scientists, engineers, and others, as long as they're
				used appropriately and designed with care.
			</div>
		</div>
	</div>
</div>

<style type="scss">
	img {
		@apply mx-auto max-h-96 my-4;
	}
</style>
