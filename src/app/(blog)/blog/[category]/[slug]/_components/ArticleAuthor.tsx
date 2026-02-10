const ArticleAuthor = ({ author }: {author: string}) => {
  if (!author) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <span className="italic">Автор: {author}</span>
    </div>
  );
};

export default ArticleAuthor;