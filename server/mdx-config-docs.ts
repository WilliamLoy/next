import { PluggableList } from "unified";
import rehypeFixTags from "./rehype-fix-tags";
import rehypeHeaders from "./rehype-headers";
import rehypeHighlight from "rehype-highlight";
import rehypeImages from "./rehype-images";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGFM from "remark-gfm";
import remarkImportFrontmatter from "./remark-import-frontmatter";
import remarkImportVariables from "./remark-import-variables";
import remarkIncludes from "./remark-includes";
import remarkLinks from "./remark-links";
import remarkVariables from "./remark-variables";
import remarkCodeSnippet from "./remark-code-snippet";
import remarkImportFiles from "./remark-import-files";

const DEFAULT_RENDERER = `
/** @jsxRuntime classic */

import { mdx } from "@mdx-js/react";
import DocsPage from "layouts/DocsPage";
const Wrapper = () => (
  <DocsPage
    meta={meta}
    navigation={navigation}
    versions={versions}
    tableOfConents={tableOfConents}
    githubUrl={githubUrl}
  >
    <MDXContent />
  </DocsPage>
);

export default Wrapper;
`;

interface MdxConfig {
  rehypePlugins: PluggableList;
  remarkPlugins: PluggableList;
  renderer: string;
  skipExport?: boolean;
}

const config: MdxConfig = {
  remarkPlugins: [
    remarkFrontmatter,
    remarkImportFrontmatter,
    remarkCodeSnippet,
    remarkImportVariables,
    remarkIncludes,
    remarkVariables,
    remarkGFM,
    remarkImportFiles,
    remarkLinks,
  ],
  rehypePlugins: [
    rehypeFixTags,
    rehypeSlug,
    rehypeImages,
    [
      rehypeHighlight,
      {
        aliases: { bash: ["bsh", "systemd", "code"], yaml: ["conf", "toml"] },
      },
    ],
    [rehypeHeaders, { maxLevel: 2 }],
  ],
  skipExport: true,
  renderer: DEFAULT_RENDERER,
};

export default config;
