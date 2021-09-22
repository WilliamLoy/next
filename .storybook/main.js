const { resolve } = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const mdxOptions = require("../.build/utils/mdx-config").default;

const COMPANY_LOGOS_DIRECTORY = resolve(__dirname, "..", "components/Company");

module.exports = {
  stories: ["../components/**/*.stories.mdx", "../components/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-actions",
  ],
  webpackFinal: async (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin({}));

    config.module.rules = config.module.rules.map((rule) => {
      if (rule.test.toString().includes("svg")) {
        const test = rule.test
          .toString()
          .replace("svg|", "")
          .replace(/\//g, "");
        return { ...rule, test: new RegExp(test) };
      } else {
        return rule;
      }
    });

    config.module.rules.push({
      test: /\.svg$/,
      exclude: [/node_modules/, COMPANY_LOGOS_DIRECTORY],
      use: ["@svgr/webpack", "file-loader"],
    });

    config.module.rules.push({
      test: /\.svg$/,
      include: [COMPANY_LOGOS_DIRECTORY],
      use: "file-loader",
    });

    const mdxRule = config.module.rules.find(
      ({ test }) => test.toString() === "/\\.mdx$/"
    );

    if (mdxRule) {
      const mdxLoaderIndex = mdxRule.use.findIndex(({ loader }) =>
        /@mdx-js/.test(loader)
      );

      if (mdxLoaderIndex >= 0) {
        mdxRule.use[mdxLoaderIndex] = {
          loader: "@mdx-js/loader",
          options: mdxOptions(false),
        };
      } else {
        throw new Error("MDX loader not found");
      }
    } else {
      throw new Error("MDX rule not found");
    }

    return config;
  },
};
