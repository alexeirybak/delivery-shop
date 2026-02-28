import { getSiteMetadata } from "./getSiteMetadata";
import { baseUrl } from "./baseUrl";
import { Metadata } from "next";

export async function generateSiteMetadata(): Promise<Metadata> {
  const metadata = await getSiteMetadata();
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: metadata.title,
      template: `%s | ${metadata.title}`,
    },
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: baseUrl,
      siteName: metadata.title,
      images: {
        url: `${baseUrl}/og-images/og-image.jpg`,
        alt: "Северяночка - Главная страница",
        width: 512,
        height: 512,
      },
    },
  };
}
