"use client";

import { ReactNode } from "react";

export default function CMSLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  return (
    <main className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      {children}
    </main>
  );
}