/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.renovabih.com",
  generateRobotsTxt: false, // We manage robots.txt manually in /public
  changefreq: "monthly",
  priority: 1.0,
  sitemapSize: 1000,
  exclude: [],
  // Outputs sitemap.xml to /public on build
  outDir: "public",
  // Transform function to add lastmod date to all URLs
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
  // Register section anchors so Google understands the page content areas
  additionalPaths: async (config) => [
    await config.transform(config, "/#usluge"),
    await config.transform(config, "/#o-nama"),
    await config.transform(config, "/#utisci"),
    await config.transform(config, "/#faq"),
    await config.transform(config, "/#kontakt"),
  ],
};
