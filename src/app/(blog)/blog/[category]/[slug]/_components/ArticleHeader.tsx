import { ArticleHeaderProps } from "../../../types";
import ArticleTitle from "./ArticleTitle";

const ArticleHeader = ({ articleTitle, categoryName }: ArticleHeaderProps) => {
  return (
    <ArticleTitle articleTitle={articleTitle} categoryName={categoryName} />
  );
};

export default ArticleHeader;