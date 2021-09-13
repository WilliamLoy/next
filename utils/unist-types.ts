import { Parent, Node, Literal } from "unist";
import { Program } from "estree-jsx";
import { Root, Element, DocType, Comment, Text } from "hast";
import { Content } from "mdast";

export interface MdxJsxAttribute {
  type: "mdxJsxAttribute";
  name: string;
  value:
    | boolean
    | number
    | string
    | null
    | undefined
    | Array<string | number>
    | ProgramEsmNode;
}

export interface MdxElement extends Parent {
  attributes: MdxJsxAttribute[];
}
export interface MdxBlockElement extends MdxElement {
  type: "mdxBlockElement";
}

export interface MdxSpanElement extends MdxElement {
  type: "mdxSpanElement";
}

export interface MdxJsxFlowElement extends MdxElement {
  type: "mdxJsxFlowElement";
}

export interface MdxJsxTextElement extends MdxElement {
  type: "mdxJsxTextElement";
}

interface ProgramEsmNode extends Node {
  type: "mdxjsEsm" | "mdxJsxAttributeValueExpression";
  value?: string;
  data: {
    estree?: Program;
  } & Literal["data"];
}

export interface PlainEsmNode extends Node {
  type: "mdxjsEsm";
  value: string;
}
export type EsmNode = PlainEsmNode | ProgramEsmNode;

export type MdxAnyElement =
  | MdxBlockElement
  | MdxSpanElement
  | MdxJsxFlowElement
  | MdxJsxTextElement;

export type RehypeNode = Root | Element | DocType | Comment | Text;

export type MdxhastNode = RehypeNode | EsmNode | MdxAnyElement;

export interface MdxhastRootNode extends Node {
  type: "root";
  children: MdxhastNode[];
}

export type MdxastNode = Content | MdxAnyElement | EsmNode;

export interface MdxastRootNode extends Node {
  type: "root";
  children?: MdxastNode[];
}
