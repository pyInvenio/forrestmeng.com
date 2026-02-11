<script lang="ts">
	let { data }: { data: { content: any; meta: Record<string, any> } } = $props();
</script>

<div class="relative mx-auto flex w-[min(86rem,95%)] flex-col justify-center my-8 z-10">
	<div class="w-full flex flex-col md:flex-row items-center">
		<div class="flex flex-col w-full lg:mr-0 mx-8 md:mt-0 mt-8">
			<h1 class="text-6xl mb-4">{data.meta.title}</h1>
			<div class="prose max-w-none my-2 [&_ul]:my-0 [&_li]:my-0">
				<data.content />
			</div>
		</div>
	</div>
</div>
