interface ArticleFullProps {
  title: string;
  content: string; // HTML с изображениями
  createdAt: string;
  slug: string;
}

const ArticleFull = ({ title, content, createdAt, slug }: ArticleFullProps) => {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <time className="text-gray-500 block mb-8">
        {new Date(createdAt).toLocaleDateString("ru-RU")}
      </time>
      
      {/* HTML из Tiptap - изображения уже внутри */}
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </article>
  );
};

export default ArticleFull;