import { getSiteMetadata } from "./getSiteMetadata";
import { baseUrl } from "./baseUrl";
import { Metadata } from "next";

export async function generateSiteMetadata(): Promise<Metadata> {
  const metadata = await getSiteMetadata();
  console.log("METADATA FETCHED", metadata);
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: metadata.title,
      template: `%s | ${metadata.title}`,
    },
    description: metadata.description,
    keywords: metadata.keywords,
    authors: [{ name: metadata.title }],
    creator: metadata.title,
    publisher: metadata.title,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: baseUrl,
      siteName: metadata.title,
      type: "website",
      locale: "ru_RU",
      images: [
        {
          url: metadata.ogImage,
          width: 512,
          height: 512,
          alt: metadata.title,
          type: "image/jpeg",
        },
      ],
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE,
      yandex: process.env.YANDEX_VERIFICATION_CODE,
    },
  };
}
