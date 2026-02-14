import { Wand2 } from "lucide-react";

const ProcessInfo = () => {
  return (
    <div className="mt-6">
      <div className="bg-white rounded-xl shadow p-6">
        <Wand2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="font-medium text-gray-900 mb-2">Как это работает?</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>1. Введите тему статьи и выберите категорию</li>
          <li>2. Нажмите &quot;Сгенерировать и сохранить статью&quot;</li>
          <li>3. AI создаст профессиональную статью</li>
          <li>4. Статья автоматически сохранится в БД</li>
          <li>5. Вы перейдете в блог для просмотра и правки</li>
        </ul>
      </div>
    </div>
  );
};

export default ProcessInfo;
