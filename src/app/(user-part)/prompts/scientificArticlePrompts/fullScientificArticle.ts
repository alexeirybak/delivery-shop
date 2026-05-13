import { ArticleSettings } from "@/store/scientificArticleSettingsStore";
import { FULL_ARTICLE_BASE_PROMPT } from "./fullScientificArticleBase";

export function getFullScientificArticlePrompt(
  mode?: string,
  generationSettings?: Partial<ArticleSettings>,
): string {
  let prompt = FULL_ARTICLE_BASE_PROMPT;

  if (generationSettings) {
    prompt += "\n\n**Дополнительные требования:**\n";

    if (generationSettings.articleLength) {
      prompt += `- Целевой объем статьи: ${generationSettings.articleLength.toLocaleString()} знаков\n`;
      prompt += `- Пиши статью до достижения этого объема. Если объем достигнут и все разделы раскрыты — добавь метку [СТАТЬЯ ЗАВЕРШЕНА]\n`;
    }

    if (generationSettings.includeAbstract) {
      prompt += `- Включи аннотацию (Abstract) на русском языке объемом ${generationSettings.abstractLength || 150} слов`;
      if (generationSettings.includeEnglishAbstract) {
        prompt += ` и аннотацию на английском языке (Abstract) того же объема`;
      }
      prompt += `\n`;
    }

    if (generationSettings.includeKeywords) {
      prompt += `- Включи ключевые слова (Keywords) на русском языке в количестве ${generationSettings.keywordsCount || 5} слов`;
      if (generationSettings.includeEnglishKeywords) {
        prompt += ` и ключевые слова на английском языке (Keywords)`;
      }
      prompt += `\n`;
    }

    if (generationSettings.includeUdk) {
      prompt += `- Добавь индекс УДК в начале статьи\n`;
    }

    if (generationSettings.includeBbk) {
      prompt += `- Добавь индекс ББК в начале статьи\n`;
    }

    if (
      generationSettings.referencesCount &&
      generationSettings.referencesCount > 0
    ) {
      prompt += `- Включи список литературы из ${generationSettings.referencesCount} источников, оформленный по ГОСТ\n`;
    }
  }

  if (mode) {
    const modeNames: Record<string, string> = {
      research: "исследовательской (эмпирической)",
      review: "обзорной",
      systematic: "систематического обзора",
      case: "кейс-стади",
      methodology: "методологической",
      conference: "тезисов для конференции",
      experimental: "экспериментальной (эмпирической)",
      literature: "литературного обзора",
      hypothesis: "статьи-гипотезы",
    };
    const modeName = modeNames[mode] || mode;
    prompt += `\n\n**Важно:** Ты пишешь статью в жанре ${modeName}. Учитывай специфику этого жанра при написании.`;
  }

  return prompt;
}
