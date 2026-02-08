export interface BlogPost {
	title: string;
	tags: string[];
	link: string;
	date: string;
	description?: string;
	slug?: string;
}

function parseDate(dateStr: string): Date {
	return new Date(dateStr);
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
	const mdModules = import.meta.glob('/src/content/blog/*.md', { eager: true }) as Record<
		string,
		{ metadata: Record<string, unknown> }
	>;

	const posts: BlogPost[] = Object.entries(mdModules).map(([path, module]) => {
		const meta = module.metadata;
		const slug = (meta.slug as string) || path.replace('/src/content/blog/', '').replace('.md', '');
		return {
			title: meta.title as string,
			tags: (meta.tags as string[]) || [],
			link: `/pages/blog/${slug}`,
			date: meta.date as string,
			description: meta.description as string | undefined,
			slug
		};
	});

	posts.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
	return posts;
}
