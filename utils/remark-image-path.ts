import value from "md-import-mapping";
import { Transformer } from "unified";
import visit from "unist-util-visit";
import { MdxastRootNode, MdxastNode } from "./unist-types";

const nodeIsImage = (node: MdxastNode) => node.type === "image";
let count = 0;
const used = new Set();

export default function remarkImagePath(): Transformer {
  return (root: MdxastRootNode) => {
    visit<MdxastNode>(root, [() => true], (node) => {
      if (!node.url) return;
      if (used.has(node.url)) return;
      const variable = `pic_${count++}`;
      const pic = {
        type: "mdxjsEsm",
        value: `import ${variable} from \"${node.url}\";`,
        data: {
          estree: {
            type: "Program",
            body: [
              {
                type: "ImportDeclaration",
                specifiers: [
                  {
                    type: "ImportSpecifier",
                    imported: {
                      type: "Identifier",
                      name: variable,
                    },
                    local: {
                      type: "Identifier",
                      name: variable,
                    },
                  },
                ],
                source: {
                  type: "Literal",
                  value: `${node.url}`,
                  raw: `\"${node.url}\"`,
                },
              },
            ],
            sourceType: "module",
          },
        },
      };

      // console.log(pic);

      root.children.unshift(pic as MdxastNode);
      used.add(node.url);
      // console.log(node);

      const srcAttr = {
        type: "mdxJsxAttribute",
        name: "src",
        value: {
          type: "mdxJsxAttributeValueExpression",
          value: variable,
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "Identifier",
                    name: variable,
                    range: [],
                  },
                  range: [],
                },
              ],
              sourceType: "module",
              comments: [],
            },
          },
        },
      };

      if (!node.attributes) {
        node.attributes = [];
      }

      delete node.url;
      (node.attributes as Array<unknown>).push(srcAttr);
      console.log(node);

      // console.log(JSON.stringify(node, null, 3));

      // node.url = pic;

      //   url: async (node) => {
      //     const nUrl = await handleUrl(node.url);
      //     const asset = transformAsset ? await transformAsset(nUrl) : nUrl;

      //     assets.push(asset);
      //     return Object.assign(node, {
      //       url: asset ? asset.url || node.url : node.url,
      //     });
      //   },
      //   link: (...args) => handlers.url(...args),
      //   definition: (...args) => handlers.url(...args),
      //   image: (...args) => handlers.url(...args),
      //   jsx: (...args) => {
      //     return handlers.html(...args, {
      //       selectors: [
      //         ['[poster]', 'poster'],
      //         ['[src]', 'src'],
      //         ['[href]', 'href'],
      //       ],
      //     });
      //   },
      //   mdxBlockElement: async (node) => {
      //     const { attributes = [] } = node;
      //     const selectors = ['poster', 'src', 'href', 'value'];
      //     return Reduce(
      //       attributes,
      //       async (node, attr, atIndex) => {
      //         const { name, value } = attr;
      //         const { attributes = [] } = node;
      //         const selector = selectors.find((selector) => {
      //           return selector === name;
      //         });
      //         if (!selector) {
      //           return node;
      //         }
      //         const nUrl = await handleUrl(value);
      //         const asset = transformAsset ? await transformAsset(nUrl) : nUrl;
      //         assets.push(asset);
      //         return Object.assign(node, {
      //           attributes: attributes.map((item, index) => {
      //             return index === atIndex
      //               ? { ...attr, value: asset ? asset.url || value : value }
      //               : item;
      //           }),
      //         });
      //       },
      //       node,
      //     );
      //   },
      //   mdxSpanElement: (...args) => handlers.mdxBlockElement(...args),
      //   mdxJsxFlowElement: (...args) => handlers.mdxBlockElement(...args),
      //   mdxJsxTextElement: (...args) => handlers.mdxBlockElement(...args),
      // };
    });
  };
}
