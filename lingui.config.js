/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["de", "en", "fr", "it"],
  sourceLocale: "de",
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
      exclude: ["**/node_modules/**"],
    },
  ],
  format: "po",
};
