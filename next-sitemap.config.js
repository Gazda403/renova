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
};
