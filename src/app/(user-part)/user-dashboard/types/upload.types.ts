export interface FileData {
  name: string;
  type: string;
  size: number;
  text: string;
  mimeType: string;
  error?: boolean;
}

export interface UploadedImage {
  base64: string;
  mimeType: string;
  url?: string;
}

export interface TextContentItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
}