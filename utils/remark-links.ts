import { Transformer } from "unified";
import { Link } from "mdast";
import visit from "unist-util-visit";
import { VFile } from "vfile";
import { isExternalLink, isHash, isPage } from "./url";
import {
  MdxastRootNode,
  MdxastNode,
  MdxAnyElement,
  EsmNode,
} from "./unist-types";

const mdxNodeTypes = new Set([
  "mdxBlockElement",
  "mdxSpanElement",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
]);

const updateHref = (basename: string, href: string) => {
  const isIndex = basename.match(/^index.mdx?$/);
  const prefix = isIndex ? "./" : "../";
  const newHref = href.replace(/(\/)?(index)?\.mdx?/, "/");
  const startsWithDot = /^\./.test(newHref);
  const startsWithSlash = /^\//.test(newHref);

  return (startsWithDot && isIndex) || startsWithSlash
    ? newHref
    : prefix + newHref;
};

const isLocalHref = (href?: string | EsmNode) => {
  if (!href) {
    return false;
  }

  if (typeof href !== "string") {
    const url = href.value;
    return !isExternalLink(url) && !isHash(url) && isPage(url);
  }

  return !isExternalLink(href) && !isHash(href) && isPage(href);
};

const isMdxComponentWithLocalHref = (node: MdxastNode): boolean => {
  return (
    mdxNodeTypes.has(node.type) &&
    !!(node as MdxAnyElement).attributes.find(
      ({ name, value }) =>
        name === "href" && isLocalHref(value as string | EsmNode)
    )
  );
};

const isRemarkLinkWilthLocalHref = (node: MdxastNode): boolean => {
  return node.type === "link" && isLocalHref(node.url);
};

const isLocalLink = (node: MdxastNode): boolean => {
  return isMdxComponentWithLocalHref(node) || isRemarkLinkWilthLocalHref(node);
};

export default function remarkLinks(): Transformer {
  return (root: MdxastRootNode, vfile: VFile) => {
    const basename = vfile?.basename || "";

    visit<Link | MdxAnyElement>(root, [isLocalLink], (node) => {
      if (node.type === "link") {
        node.url = updateHref(basename, node.url);
      } else if (mdxNodeTypes.has(node.type)) {
        const hrefAttribute = node.attributes.find(
          ({ name }) => name === "href"
        );

        hrefAttribute.value = updateHref(
          basename,
          hrefAttribute.value as string
        );
      }
    });
  };
}
