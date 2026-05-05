const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://banjaratravels.in';

const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/services', changefreq: 'monthly', priority: '0.9' },
  { path: '/visa', changefreq: 'weekly', priority: '0.95' },
  { path: '/india-visa', changefreq: 'monthly', priority: '0.9' },
  { path: '/apply', changefreq: 'monthly', priority: '0.9' },
  { path: '/track', changefreq: 'monthly', priority: '0.6' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/tickets', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/b2b', changefreq: 'monthly', priority: '0.7' }
];

const generateSitemap = () => {
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path === '/' ? '' : route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const publicPath = path.join(__dirname, 'public', 'sitemap.xml');
  fs.writeFileSync(publicPath, sitemapXml, 'utf8');
  console.log(`\x1b[32m%s\x1b[0m`, `✅ Dynamic sitemap.xml generated successfully at ${publicPath}!`);
};

generateSitemap();
