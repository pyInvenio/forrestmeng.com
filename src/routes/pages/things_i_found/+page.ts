import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const page = await import('../../../content/things_i_found.md');
	return {
		content: page.default,
		meta: page.metadata
	};
};
