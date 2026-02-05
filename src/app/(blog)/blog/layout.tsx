"use client";

import { ReactNode } from "react";
import BlogSearch from "./[category]/_components/BlogSearch";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="mb-8">
        <BlogSearch />
      </div>

      {children}
      <ScrollToTopButton appearPos={300} finishPos={800}/>
    </div>
  );
}
