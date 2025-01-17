export interface PodcastEpisode {
  frontmatter: {
    podcastName: string;
    title: string;
    description: string;
  };
  uri: string;
}

export interface TechPaperBook {
  frontmatter: {
    podcastName: string;
    title: string;
    description: string;
    publicationDate: string;
    cardTitle?: string;
    brief?: string;
  };
  uri: string;
}

export interface CardParams {
  cardBG: string;
  cardBC: string;
  src: string;
  caption: string;
}

export type EpisodeKind =
  | "podcast"
  | "techPaper"
  | "tutorial"
  | "auditReport"
  | "webinar";

export interface ResourceItem {
  id: string;
  title: string;
  href: string;
}

export interface AuditReport {
  frontmatter: {
    alternateTitle?: string;
    auditPdf: string;
    authors: string;
    coverPhotoYear: string;
    description: string;
    publicationDate: string;
    title: string;
  };
  uri: string;
}

export interface Tutorial {
  frontmatter: {
    alternateTitle?: string;
    description: string;
    tutorialPublicationDate: string;
    title: string;
    videoId: string;
  };
  uri: string;
}
