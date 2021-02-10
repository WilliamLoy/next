// Moved this types to separate file to simplyfy loaders build that requires them

import { HeaderMeta } from "components/AnchorNavigation/types";
import type { IconName } from "components/Icon/types";

export interface NavigationItem {
  title: string;
  slug: string;
}

export interface NavigationCategory {
  icon: IconName;
  title: string;
  entries: NavigationItem[];
}

export interface VersionsInfo {
  current: string;
  latest: string;
  available: string[];
}

export interface PageMeta {
  title?: string;
  description?: string;
  h1?: string;
  headers: HeaderMeta[];
  githubUrl: string;
}