"use client";

import { useAuthStore } from "@/store/authStore";
import { Edit } from "lucide-react";
import Link from "next/link";

const EditLink = ({ articleId }: { articleId: string }) => {
  const { user } = useAuthStore();

  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return null;
  }
  
  return (
    <div className="fixed top-6 right-6 z-50">
      <Link
        href={`/administrator/cms/articles/editor?id=${articleId}`}
        className="group relative"
        title="Редактировать"
      >
        <div className="absolute inset-0 bg-linear-to-r from-green-400 to-green-600 rounded-full blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
        
        <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg border border-gray-200 group-hover:border-green-300 transition-all duration-300">
          <Edit className="w-5 h-5 text-green-600 group-hover:text-green-700 transition-colors" />
        </div>
      </Link>
    </div>
  );
};

export default EditLink;