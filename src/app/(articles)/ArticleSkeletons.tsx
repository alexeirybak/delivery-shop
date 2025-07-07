import { FC } from "react";

const ArticleSkeletons: FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <li
          key={`skeleton-${index}`}
          className="w-full h-75 md:h-105 bg-gray-100 animate-pulse rounded-lg"
        />
      ))}
    </ul>
  );
};

export default ArticleSkeletons;