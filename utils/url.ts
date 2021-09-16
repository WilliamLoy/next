import { NextRouter } from "next/router";
import getConfig from "./config-site";

export const host = process.env.NEXT_PUBLIC_HOST;

export const isExternalLink = (href: string): boolean =>
  href.startsWith("//") || href.startsWith("mailto:") || href.includes("://");

export const isHash = (href: string): boolean => href.startsWith("#");

export const isMdxLink = (href: string): boolean => /\.md(x)?(#|$)/.test(href);

export const isExtensionLess = (href: string): boolean => {
  const parts = href.split("/");
  const lastPart = parts[parts.length - 1];

  return !lastPart.includes(".");
};

export const isPage = (href: string): boolean =>
  isMdxLink(href) || isExtensionLess(href);

export const getVersionAsPath = (href: string) => {
  const { latest } = getConfig();

  return href.replace(`/ver/${latest}`, "");
};

export const extractPath = (href: string) => {
  return href.split("#")[0].split("?")[0];
};

export const getPath = (href: string) => {
  const base = getVersionAsPath(extractPath(href));

  // In SSR mode next ignores trailingSlsh option in asPath
  return base.endsWith("/") ? base : `${base}/`;
};

export const getHash = (href: string) => href.split("#")[1];

export const buildCanonicalUrl = (router: NextRouter) => {
  const path = getVersionAsPath(router.asPath);

  return `${host}${path}`;
};

const imgPattern = /\.(png|jpg|svg|webp|gif|avif|jp2|jpx|jpg2)$/;
const urlPattern = /^(https?:)/;

export const isImage = (href?: string) =>
  imgPattern.test(href) && !urlPattern.test(href);
