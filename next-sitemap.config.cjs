/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://raf-advanced.sa',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 7000,
    exclude: ['/404', '/500'],
    alternateRefs: [
      {
        href: 'https://raf-advanced.sa/en',
        hreflang: 'en',
      },
      {
        href: 'https://raf-advanced.sa/ar',
        hreflang: 'ar',
      },
    ],
    transform: async (config, path) => {
      return {
        loc: path,
        changefreq: config.changefreq,
        priority: path === '/' ? 1.0 : config.priority,
        lastmod: new Date().toISOString(),
        alternateRefs: config.alternateRefs ?? [],
      }
    },
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/404', '/500', '/api'],
        },
      ],
      additionalSitemaps: [
        'https://raf-advanced.sa/sitemap.xml',
      ],
    },
  }