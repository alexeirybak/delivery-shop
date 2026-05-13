"use client";

import dynamic from "next/dynamic";
import "./not-found.css";

const NotFoundContent = dynamic(() => import("./NotFoundContent"), {
  ssr: false,
});

export default function NotFoundWrapper() {
  return (
    <div className="not-found-container">
      <NotFoundContent />
    </div>
  );
}