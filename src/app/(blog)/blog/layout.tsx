import { ReactNode } from "react";
import BlogSearch from "./[category]/_components/BlogSearch";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import BlogShareButtons from "./BlogShareButtons";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="mb-8">
        <BlogSearch />
      </div>

      {children}

      <div className="mt-12 pt-8 border-t">
        <div className="max-w-2xl mx-auto text-center">
          <BlogShareButtons />
        </div>
      </div>

      <ScrollToTopButton appearPos={300} finishPos={800} />
    </div>
  );
}
