import { Image, Link } from "mdast";
import { Transformer } from "unified";
import visit from "unist-util-visit";
import {
  MdxastRootNode,
  MdxastNode,
  MdxJsxAttribute,
  MdxJsxFlowElement,
} from "./unist-types";
import { isImage } from "./url";

export interface RemarkImagePathOptions {
  /**
   * By default imports are resolved relative to the markdown file. This matches default markdown
   * behaviour. If this is set to false, this behaviour is removed and URLs are no longer processed.
   * This allows to import images from `node_modules`. If this is disabled, local images can still
   * be imported by prepending the path with `./`.
   *
   * @default true
   */
  resolve?: boolean;
}

const relativePathPattern = /\.\.?\//;
const urlPattern = /^(https?:)?\//;
const getLocalPath = (nodeAttributes: MdxJsxAttribute[], attrName: string) =>
  nodeAttributes.find((attr) => attr.name === attrName).value as string;
const isRemarkLinkWilthLocalHref = (node: MdxastNode): boolean => {
  if (node.name === "a") {
    return isImage(getLocalPath(node.attributes as MdxJsxAttribute[], "href"));
  }
};
const nodeIsVideoSource = (node: MdxJsxFlowElement) => node.name === "source";
const nodeIsPoster = (node: MdxJsxFlowElement) => {
  if (node.type === "mdxJsxFlowElement" && node.name === "video") {
    return node.attributes.some((attr) => attr.name === "poster");
  }
  return false;
};

const createImageObject = (
  imports: MdxastNode[],
  imported: Map<string, string>,
  url: string,
  name: string
) => {
  if (!name) {
    name = `__${imported.size}_${url.replace(/\W/g, "_")}__`;

    imports.push({
      type: "mdxjsEsm",
      value: `import ${name} from \"${url}\";`,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ImportDeclaration",
              source: {
                type: "Literal",
                value: url,
                raw: JSON.stringify(url),
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: { type: "Identifier", name },
                },
              ],
            },
          ],
        },
      },
    });
    imported.set(url, name);
  }

  return name;
};

export default function remarkImagePath(
  { resolve }: RemarkImagePathOptions = { resolve: true }
): Transformer {
  return (root: MdxastRootNode) => {
    const imports: MdxastNode[] = [];
    const imported = new Map<string, string>();

    visit<Link>(root, [isRemarkLinkWilthLocalHref], (node, index, parent) => {
      let href = getLocalPath(node.attributes as MdxJsxAttribute[], "href");

      if (!relativePathPattern.test(href) && resolve) {
        href = `./${href}`;
      }

      let name = imported.get(href);

      name = createImageObject(imports, imported, href, name);

      const newLink = {
        type: "mdxJsxTextElement",
        name: "a",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "href",
            value: {
              type: "mdxJsxAttributeValueExpression",
              value: `${name}.src`,
              data: {
                estree: {
                  type: "Program",
                  sourceType: "module",
                  comments: [],
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "MemberExpression",
                        object: {
                          type: "Identifier",
                          name,
                        },
                        property: {
                          type: "Identifier",
                          name: "src",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          { type: "mdxJsxAttribute", name: "download", value: null },
        ],
        children: node.children,
      };

      parent.children.splice(index, 1, newLink);
    });

    visit<Image>(root, "image", (node, index, parent) => {
      const { alt = null, title } = node;
      let { url } = node;

      if (urlPattern.test(url)) {
        return;
      }
      if (!relativePathPattern.test(url) && resolve) {
        url = `./${url}`;
      }

      let name = imported.get(url);

      name = createImageObject(imports, imported, url, name);

      const textElement = {
        type: "mdxJsxTextElement",
        name: "img",
        children: [],
        attributes: [
          { type: "mdxJsxAttribute", name: "alt", value: alt },
          {
            type: "mdxJsxAttribute",
            name: "src",
            value: {
              type: "mdxJsxAttributeValueExpression",
              value: name,
              data: {
                estree: {
                  type: "Program",
                  sourceType: "module",
                  comments: [],
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: { type: "Identifier", name },
                    },
                  ],
                },
              },
            },
          },
        ],
      };

      if (title) {
        textElement.attributes.push({
          type: "mdxJsxAttribute",
          name: "title",
          value: title,
        });
      }

      parent.children.splice(index, 1, textElement);
    });

    visit<MdxJsxFlowElement>(
      root,
      [nodeIsVideoSource],
      (node, index, parent) => {
        let videoUrl = getLocalPath(
          node.attributes as MdxJsxAttribute[],
          "src"
        );

        if (!relativePathPattern.test(videoUrl) && resolve) {
          videoUrl = `./${videoUrl}`;
        }

        let name = imported.get(videoUrl);

        name = createImageObject(imports, imported, videoUrl, name);

        const newSource = { ...node };
        newSource.attributes = newSource.attributes.map((elem) => {
          if (elem.name === "src") {
            return {
              type: "mdxJsxAttribute",
              name: "src",
              value: {
                type: "mdxJsxAttributeValueExpression",
                value: `${name}`,
                data: {
                  estree: {
                    type: "Program",
                    sourceType: "module",
                    comments: [],
                    body: [
                      {
                        type: "ExpressionStatement",
                        expression: { type: "Identifier", name },
                      },
                    ],
                  },
                },
              },
            };
          }
          return elem;
        });
        parent.children.splice(index, 1, newSource);
      }
    );

    visit<MdxJsxFlowElement>(root, [nodeIsPoster], (node, index, parent) => {
      let posterSrc = getLocalPath(
        node.attributes as MdxJsxAttribute[],
        "poster"
      );

      if (urlPattern.test(posterSrc)) {
        return;
      }
      if (!relativePathPattern.test(posterSrc) && resolve) {
        posterSrc = `./${posterSrc}`;
      }

      let name = imported.get(posterSrc);

      name = createImageObject(imports, imported, posterSrc, name);

      const newSrcPoster = { ...node };
      newSrcPoster.attributes = newSrcPoster.attributes.map((elem) => {
        if (elem.name === "poster") {
          return {
            type: "mdxJsxAttribute",
            name: "poster",
            value: {
              type: "mdxJsxAttributeValueExpression",
              value: `${name}.src`,
              data: {
                estree: {
                  type: "Program",
                  sourceType: "module",
                  comments: [],
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "MemberExpression",
                        object: {
                          type: "Identifier",
                          name,
                        },
                        property: {
                          type: "Identifier",
                          name: "src",
                        },
                        computed: false,
                        optional: false,
                      },
                    },
                  ],
                },
              },
            },
          };
        }
        return elem;
      });
      parent.children.splice(index, 1, newSrcPoster);
    });

    root.children.unshift(...imports);
  };
}
