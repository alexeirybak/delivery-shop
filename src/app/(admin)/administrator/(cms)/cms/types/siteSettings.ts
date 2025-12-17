import { ObjectId } from "mongodb";

export interface SiteSettings {
  _id: ObjectId | string;
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