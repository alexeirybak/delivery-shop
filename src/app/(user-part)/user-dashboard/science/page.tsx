import type { Metadata } from "next";
import ScientificArticleGeneratorContent from "./_components/ScientificArticleGeneratorContent";

export const metadata: Metadata = {
  title: "Генератор научных статей | NeuroDidactica AI",
  description:
    "Создавайте научные статьи с помощью ИИ. Генерация аннотации, ключевых слов, структурированных разделов и списка литературы по заданной теме.",
  keywords: [
    "генератор научных статей",
    "AI для науки",
    "написание статей ИИ",
    "академический текст",
    "научная публикация",
    "NeuroDidactica",
  ],
};

const ScientificArticleGenerator = () => {
  return <ScientificArticleGeneratorContent />;
};

export default ScientificArticleGenerator;
