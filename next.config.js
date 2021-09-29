/* eslint-env node */
const { resolve } = require("path");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const mdxOptions = require("./.build/utils/mdx-config");
const mdxSiteOptions = require("./.build/utils/mdx-config-site");
const mdxDocsOptions = require("./.build/utils/mdx-config-docs");
const {
  getRedirects,
  getLatestVersionRewirites,
  generateSitemap,
  generateFullSitemap,
} = require("./.build/utils/paths");

const PAGES_DIRECTORY = resolve(__dirname, "pages");
const DOCS_DIRECTORY = resolve(__dirname, "pages/docs");
const CONTENT_DIRECTORY = resolve(__dirname, "content");
const COMPANY_LOGOS_DIRECTORY = resolve(__dirname, "components/Company");

module.exports = withBundleAnalyzer({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  rewrites: async () => getLatestVersionRewirites(),
  redirects: async () => getRedirects(),
  images: {
    path: "/_next/image/",
    disableStaticImages: true,
    domains: ["i.ytimg.com"],
  },
  trailingSlash: true,
  webpack: (config, options) => {
    if (!options.dev) {
      generateSitemap();
      generateFullSitemap();
    }

    config.output.assetModuleFilename = "static/images/[hash][ext]";

    config.module.rules.push({
      test: /\.svg$/,
      exclude: [/node_modules/, COMPANY_LOGOS_DIRECTORY],
      use: [
        "@svgr/webpack",
        {
          loader: "file-loader",
          options: {
            publicPath: `/_next/static/images/`,
            outputPath: "static/images/",
            name: "[hash].[ext]",
          },
        },
      ],
    });
    config.module.rules.push({
      test: /\.svg$/,
      include: [COMPANY_LOGOS_DIRECTORY],
      type: "asset/resource",
    });
    config.module.rules.push({
      test: /\.(png|jpg)$/i,
      type: "asset/resource",
      exclude: /node_modules/,
    });
    config.module.rules.push({
      test: /\.(md|mdx)$/,
      include: [DOCS_DIRECTORY, CONTENT_DIRECTORY],
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
          options: mdxDocsOptions.default,
        },
      ],
    });
    config.module.rules.push({
      test: /\.(md|mdx)$/,
      include: PAGES_DIRECTORY,
      exclude: DOCS_DIRECTORY,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
          options: mdxSiteOptions.default,
        },
      ],
    });
    config.module.rules.push({
      test: /\.(md|mdx)$/,
      exclude: [PAGES_DIRECTORY, CONTENT_DIRECTORY],
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
          options: mdxOptions.default,
        },
      ],
    });

    config.module.rules.push({
      test: /\.ya?ml$/,
      type: "json",
      use: "yaml-loader",
    });

    return config;
  },
});
