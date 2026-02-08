import { getAllBlogPosts } from '$lib/utils/blog';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const posts = await getAllBlogPosts();
	return { posts };
};
