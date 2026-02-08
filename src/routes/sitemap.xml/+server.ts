import { getAllBlogPosts } from '$lib/utils/blog';

const siteUrl = 'https://forrestmeng.com';

const staticPages = [
	{ path: '/', priority: '1.0' },
	{ path: '/pages/aboutme', priority: '0.8' },
	{ path: '/pages/work', priority: '0.8' },
	{ path: '/pages/projects', priority: '0.8' },
	{ path: '/pages/creations', priority: '0.5' },
	{ path: '/pages/blog', priority: '0.9' },
	{ path: '/pages/contact', priority: '0.6' }
];

function getAllProjectPages(): { slug: string }[] {
	const mdModules = import.meta.glob('/src/content/projects/*.md', { eager: true }) as Record<
		string,
		{ metadata: Record<string, unknown> }
	>;
	return Object.entries(mdModules).map(([path, module]) => {
		const meta = module.metadata;
		const slug = (meta.slug as string) || path.replace('/src/content/projects/', '').replace('.md', '');
		return { slug };
	});
}

export async function GET() {
	const posts = await getAllBlogPosts();
	const projects = getAllProjectPages();

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map((p) => `  <url><loc>${siteUrl}${p.path}</loc><priority>${p.priority}</priority></url>`).join('\n')}
${posts.map((p) => `  <url><loc>${siteUrl}${p.link}</loc><priority>0.7</priority></url>`).join('\n')}
${projects.map((p) => `  <url><loc>${siteUrl}/pages/projects/${p.slug}</loc><priority>0.7</priority></url>`).join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
