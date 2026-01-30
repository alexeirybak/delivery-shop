const EmptyCategory = () => {
  return (
    <div className="text-center text-main-text py-12">
      <div className="inline-block p-8 bg-gray-50 rounded-2xl mb-6">
        <h2 className="text-2xl font-bold mb-4">
          В этой категории пока нет статей
        </h2>
        <p>Загляните позже или посмотрите другие категории</p>
      </div>
    </div>
  );
};

export default EmptyCategory;