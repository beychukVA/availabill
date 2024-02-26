/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["de", "en", "fr", "it"],
    defaultLocale: "de",
    localeDetection: false,
  },
};

module.exports = nextConfig;
