const EmptyCategory = ({ hasImage }: {hasImage: boolean}) => {
  return (
    <div className="text-center text-main-text py-12">
      {!hasImage ? (
        <div className="inline-block p-8 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold mb-4">
            В этой категории пока нет статей
          </h2>
          <p>Загляните позже или посмотрите другие категории</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            В этой категории пока нет статей
          </h2>
          <p>Загляните позже или посмотрите другие категории</p>
        </>
      )}
    </div>
  );
};

export default EmptyCategory;