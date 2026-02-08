import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../../content/projects/${params.slug}.md`);
		return {
			content: post.default,
			meta: post.metadata
		};
	} catch {
		error(404, `Project not found: ${params.slug}`);
	}
};
