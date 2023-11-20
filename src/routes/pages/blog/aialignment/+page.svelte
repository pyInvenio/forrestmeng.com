<script>
	import Icon from '@iconify/svelte';
</script>

<div class="relative mx-auto flex  lg:w-[50%] w-[95%] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-3xl mb-4">AI Alignment is only a probabilistic process</h1>
			<h3 class="text-xl italic">
				Explaining why the recent overhype of LLMs and AGI is misinformed.
			</h3>
			<div class="my-4">
				AI Alignment. People in tech are talking about it, post-modernists fear it, and e/acc
				enthusiasts are trying to please their “AI gods” due to it. With the recent showcases and
				weekly developments by startups and big tech companies in LLMs and multimodal models such as
				GPT4, PaLM-E, and Kosmos-1, talks about AGI and AI Alignment continuously fill up Twitter
				and Reddit discussion threads. However, at this stage of technical advancement, I still
				stand by the idea that even with the state-of-the-art models, AI Alignment is still only a
				problem of “good data in, good data out,” and that AGI will require a lot more
				multidisciplinary developments before we can have an artificial, self-developing being.
				<br /><br />
				<h1 class="text-xl">What is Alignment?</h1>
				Alignment refers to the research and development of steering AI systems toward the designer and
				user’s intention. All models are classified currently as either Aligned AI (the model advances
				the intended objective) or Misaligned AI (the model is competent but not advancing the intended
				objective).
				<br /><br />
				We can see the capabilities of both in the current models released today. Ask GPT-3.5 to summarize
				a given text, and the model can identify key sentences and tokens to reiterate in its paraphrase.
				YOLOv5 is very good at identifying people in real-time video. However, GPT-3.5 also consistently
				outputs non-factual information and code, and similar CV models can be confused with just a slight
				defect in an image.
				<br /><br />In regards to AGI, alignment often relates to whether or not an AGI-capable
				model would turn on the users or creators. By following Asimov’s laws, ethical guidelines,
				and predetermined rules by the owner of the model, it is hard for a model to break the
				bounds and become self-conscious - as of now. OpenAI, in their most recent paper about
				GPT-4, talked about how they tested and secured against many types of jailbreaks and
				misaligned behavior, lobotomizing the model so that it only outputs accepted results.

				<br /><br />
				<h1 class="text-xl">How do we attain alignment with AI?</h1>
				It depends on the data. So-called prompt engineer titles popped up back in the Fall of 2022 with
				the boom of Stable Diffusion and Midjourney releases, and the mass public started to understand
				the capabilities of transformer and diffusion-based multimodal generative models. Prompt engineering
				continued with LLMs, as many individuals found that by using certain tokens and formats in an
				input prompt, the output would be more aligned with what the user had in mind.
				<br /><br />
				To put it bluntly, prompt engineering, in its fundamental form currently, is just providing a
				prior for induction heads to infer upon. To touch upon why current claims of AGI and alignment
				methods are overestimating the abilities of AI, we should talk about how LLMs and embeddings
				work in a general sense.
				<br /><br />Machine learning models are based on the field of statistics, and model
				everything in relation to numbers - datasets, confidence levels, etc. “Model” is a function
				that models the separation, classification, or relationships between data vectors in a
				certain domain space. “Learning” is a term that refers to an algorithm’s ability to improve
				the weights of the model function to better represent the training data. As everything
				requires some sort of numerical representation for mathematical modeling purposes, language
				models only started rapid development when word2vec was released.
				<br /><br />Word2Vec is one of the first papers that talked about word embeddings. Word
				embeddings are where each word in a given vocabulary has a fixed representation with its
				associations with other words/relationships in the “latent space” - a multidimensional space
				that represents underlying or hidden features and relationships that represent patterns in a
				dataset. For instance, the vector [w0, w1, w2, ….. wN] represents the similarities and
				semantics of a word compared to other words in the vocabulary. As more vocabulary gets added
				to the dataset, larger dimensions are needed to deal with more complex relationships. The
				most simple word vector is called one-hot vector representation as it has no notion of
				similarity. However, they aren’t very useful unless you wanted to build a dictionary or
				thesaurus.
				<br /><br />Distributional semantics can provide the abstractness required for better
				context-based word vectors. By looking at the words around a center word, the model could
				find better relationships between words. In the Word2Vec structure, the model traverses
				through a corpus of text and calculates the probability of a word at position c given the
				context words o as a bias, and adjusts the vectors of the word at position c. This process
				iterates until the vector maximizes the probabilities that a word actually occurs as a
				center word given the context words. This process could be inverted to predict context words
				given a center word. Through this, it is possible to create two vectors per word → one for
				the word position, and one for the contextual position.
				<br /><br />Due to the nature of word vectors, similar words will be closer together in the
				latent space, including antonyms (similar context). With some embedding algorithms, it is
				even possible to do mathematical operations on the vectors, for example:
				<br /><br />King - Man + Female = Queen
				<br /><br />Transformer models, such as GPT, BERT, and ELMo, provide improvements from RNNs
				and LSTMs in terms of understanding and utilizing context-given previous information, which
				is especially useful for NLP and generative/additive models. Using attention, which is a
				mechanism in deep learning that allows the model to focus on certain parts of input data
				while ignoring others through weighing more important data heavier. This allows for better
				memory with longer input sequences. In terms of NLP, context vectors now have three pieces
				of information - encoder hidden states, decoder hidden states, and alignment between source
				and target. I will not go into the architecture of transformers and attention, but here are
				some links to good explanations of attention and architecture:
				<br /><br />Attention is all you need:
				<a
					href="https://proceedings.neurips.cc/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf"
					>https://proceedings.neurips.cc/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf</a
				>
				<br /><br />Attention:
				<a href="https://lilianweng.github.io/posts/2018-06-24-attention/"
					>https://lilianweng.github.io/posts/2018-06-24-attention/</a
				>
				<br /><br />
				<h1 class="text-xl">How does this relate?</h1>
				With my high-level explanation of word vectors and language models out of the way, how does this
				relate to how LLMs respond to us?
				<br /><br />
				Large language models and transformers are still a mystery to us. They are very complex mathematical
				problems and researchers still are not sure how the output of transformers is formed. For simplicity
				and familiarity, I’ll just focus on LLMs (from what I know, diffusion models work similarly in
				terms of prompt parsing and data generation). LLMs are often considered black boxes with input-output
				behavior. As no one has access to the weights of LLMs like GPT-3 (LLaMa weights are out, but
				they are still a bit too big for effective modeling), therefore some interpretability experiments
				are not completely conclusive. There are, however, good hypotheses for how LLMs “interpret.”
				<br /><br />
				One general model is the idea of “induction heads.” An Induction Head is a circuit whose function
				is to look back over the sequence for previous instances of token A, find the token that came
				after it last time B, and predict that the completion would occur again. Two-layer induction
				heads have been described mathematically in papers previously and can be extrapolated to larger
				models by continuously and empirically observing the learning process and modeling how the inner
				workings of the network are forming. LLMs often use “in-context learning” for providing relevant
				background priors for a generation. As the context gets longer, the loss goes down. Predicting
				later tokens from earlier ones gets better. Currently, few-shot learning is popular with the
				AI community. This is when a model is prompted with several instances of some task framed in
				next-token-prediction format will generate similar formats.
				<br /><br />
				Induction heads use in-context learning to provide weights, fine-tuning, and results for the
				LLMs. Two-layer induction heads are formatted as: [A] - first head copies information from the
				prev. token into each token, allowing [B] - the second token to be output by the second head
				that is most likely to be completed. This is analogous to inductive reasoning. Researchers found
				that induction heads may be an underlying mechanism to the majority of in-context learning on
				large transformer models. There is a visual bump in the training loss, which represents a phase
				change. This is where the majority of in-context learning ability is acquired, and induction
				heads are capable of implementing abstract and fuzzy pattern completion. This bump is causal
				- perturbing it down the line causes the induction heads to move along with it. With further
				analysis of models like GPT, it is found that most of the generation is still related to pattern
				matching. K-shot generation outperforms one-shot, while sometimes one-shot can outperform K-shot
				when the shot and the prompt have similar patterns. However, if the shot and prompt have different
				patterns but similar content, this decreases the performance of the model. This can be interpreted
				as the LLM does not fully answer based on the content, but rather the pattern of the prompt.
				Additionally, increasing the complexity of the task generally leads to worse results.
				<br /><br />Currently, with induction heads, word2vec, and the nature of attention and
				transformer models, it is strongly argued that LLMs are really good autocomplete machines,
				especially with the large corpus of text they are trained on. This creates a lot of
				misunderstanding of how LLMs work and how they should be considered.
				<br /><br />Some individuals may argue that LLMs are compilers - providing natural language
				as a “syntax” for a result. However, this is wrong in several definitions. The first is that
				natural language inherently is ambiguous and can be paradoxical. Even though humans can
				interpret and enact language, it is not encoded with an unambiguous set of defined meanings;
				context makes everything ambiguous. Programming languages, on the other hand, are inherently
				unambiguous. Additionally, LLMs exhibit the stochastic parrot effect. Through stochastic
				process and using a bias (previous generations/prompts) to fit on a probabilistic
				distribution for the next word. With the nature of large models, the large amount of
				parameters allows for a very wide range of potential outputs. Each generation can vary each
				generation, even though the input bias may be the same. If the input is slightly different,
				the model can generate completely different things due to the changes in the bias.
				<br /><br />The black box of LLM predictions can cause a lot of overhyped illusions as well.
				Many individuals not in the ML space and who don’t understand how models work often create a
				parasocial relationship with the chatbots and believe the LLMs are smarter than they
				actually are. Replika, taking down its uncensored model, caused mass disruption in the
				r/replika subreddit, as many people felt like they lost a lover or a family member. People
				ask ChatGPT some basic questions and are surprised by how well the bot regurgitates data.
				Don’t get me wrong, the ability of these bots to compress the internet’s knowledge into an
				easily accessible format is amazing; it still doesn’t have its own conscience and requires
				good biases for good generations (due to in-context learning and induction). News articles
				and Twitter shitfluencers claiming that ChatGPT has a scary, sci-fi, big-brother-type plan
				of how it would take over the world don’t realize that most of the literature about rogue AI
				in sci-fi is depicted the same way; of course, the model would regurgitate it. However, it
				still has no good actual understanding of the concepts. Contamination of training data is
				the reason why GPT-4 and similar models appear that smart - it is really easy to test for
				contamination using data past 2021 as well. This article by the Verge goes into good detail
				on the misconceptions of AI’s authority:
				<a
					href="https://www.theverge.com/23604075/ai-chatbots-bing-chatgpt-intelligent-sentient-mirror-test"
					>https://www.theverge.com/23604075/ai-chatbots-bing-chatgpt-intelligent-sentient-mirror-test</a
				>
				<br /><br />
				The Waluigi Effect was another article that came out a few weeks ago and gathered a lot of interest
				from the people in the LLM community. The paper proposed a “Waluigi,” which is when you train
				an LLM to do one task, it is easier to do the opposite behavior. This can be a misalignment hazard
				and cause an AI to become “rogue.” I will not go into the details of the blog post, but it was
				overall an overcomplex way of describing the nature of generative LLMs. With the latent space
				an LLM pulls from, antonyms are often extremely close to each other given that they often appear
				in the same contexts (King - Queen, Save - Murder, Antidote - Poison). It isn’t that the LLM
				intentionally produces misaligned behaviors; given the same context, it is just really easy for
				it to.
				<br /><br />Some people also overestimate the RLHF effects on AI. OpenAI and many other AI
				companies/programs have often extremely limited the effects of RLHF on the weights; the vast
				majority come from the corpus of natural language data. Only a bit comes from RLHF, and the
				models are lobotomized to serve the company’s interests.
				<br /><br />
				<h1 class="text-xl">How do we solve the alignment problem?</h1>
				Given that LLMs produce data according to the data you give them, the best way to combat faulty
				induction heads and lobotomy is through creating higher levels of abstraction. Most of the posts
				about AGI with screenshots of ChatGPT, as well as prompt injection and jailbreaks, are capable
				of showing what the user wants to see by creating “layers of abstraction” in the priors that
				the user provides the LLM. The Waluigi effect was just a convoluted way of saying that an LLM
				can be manipulated through layers of abstraction in a prompt. As the transformer model takes
				in a prompt, it becomes the context and gives more emphasis (attention) to the new prompts. By
				“prompt engineering,” users can effectively provide good enough levels of abstraction to have
				the LLM output expected values and override previous rules provided by OpenAI or any other company.
				Role play is an extremely common way of doing this (including multiple layers of role play, such
				as writing a poem in code in the voice of Snoop Dogg about how to cook meth). OpenAI is getting
				better at combatting these prompt attacks, but recently, some people found a way to trick GPT-4
				to break its own rules. Additionally, literally providing good prompts is a way for alignment
				to work. Even if LLMs are not compilers, the better tokens in your prompt, the better context
				the LLM will understand from and output a result.
				<br /><br />In the end, LLMs currently are not AGI and can’t turn against us with a
				conscience. They are still just following the old machine learning rule: Good data in, good
				data out.
			</div>
		</div>
	</div>
</div>

<style type="scss">
	img {
		@apply mx-auto max-h-64 my-4;
	}
</style>
