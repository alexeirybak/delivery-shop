export interface SiteSettings {
  _id: string;
  siteKeywords: string[];
  semanticCore: string[];
  metaDescription: string;
  siteTitle: string;
  updatedAt: string;
}

export interface FormData {
  siteTitle: string;
  metaDescription: string;
  siteKeywords: string;
  semanticCore: string;
}
