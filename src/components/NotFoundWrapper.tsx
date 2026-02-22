"use client";

import dynamic from "next/dynamic";

const NotFoundContent = dynamic(
  () => import("@/components/NotFoundContent"),
  { ssr: false }
);

export default function NotFoundWrapper() {
  return <NotFoundContent />;
}