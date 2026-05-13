import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://neurodidactica.ru";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/user-profile/",
        "/_next/",
        "/*.json",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
