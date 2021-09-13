import { Image } from "mdast";
import { Transformer } from "unified";
import visit from "unist-util-visit";
import { MdxastRootNode, MdxastNode } from "./unist-types";

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

const urlPattern = /^(https?:)?\//;
const relativePathPattern = /\.\.?\//;

export default function remarkImagePath(
  { resolve }: RemarkImagePathOptions = { resolve: true }
): Transformer {
  return (root: MdxastRootNode) => {
    const imports: MdxastNode[] = [];
    const imported = new Map<string, string>();

    visit<Image>(root, "image", (node, index, parent) => {
      const { alt = null, title } = node;
      let { url } = node;
      console.log(url);

      if (urlPattern.test(url)) {
        return;
      }
      if (!relativePathPattern.test(url) && resolve) {
        url = `./${url}`;
      }

      let name = imported.get(url);

      if (!name) {
        name = `__${imported.size}_${url.replace(/\W/g, "_")}__`;

        imports.push({
          type: "mdxjsEsm",
          value: `import ${name} from \"${node.url}\";`,
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

    root.children.unshift(...imports);
  };
}
