import { ReactNode } from "react";
import BlogSearch from "./BlogSearch";
import ScrollTopButton from "@/components/ScrollToTopButton";
import BlogShareButtons from "./BlogShareButtons";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <BlogSearch />
      </div>

      {children}
      <BlogShareButtons />
      <ScrollTopButton appearPos={300} />
    </div>
  );
}
