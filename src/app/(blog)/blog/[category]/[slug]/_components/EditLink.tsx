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
    <>
      <Link
        href={`/administrator/cms/articles/editor?id=${articleId}`}
        className="absolute top-0 right-0"
        title="Редактировать"
      >
        <Edit className="w-5 h-5 text-green-600" />
      </Link>
    </>
  );
};

export default EditLink;
