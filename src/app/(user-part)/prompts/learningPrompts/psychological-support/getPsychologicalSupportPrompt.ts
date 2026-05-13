import { PsychologicalSettings } from "@/store/voiceSettingsStore";
import {
  PSYCHOLOGICAL_SUPPORT_BASE_PROMPT_FEMALE,
  PSYCHOLOGICAL_SUPPORT_BASE_PROMPT_MALE,
} from "./psychologicalSupportBase";

export function getPsychologicalSupportPrompt(settings?: PsychologicalSettings): string {
  let prompt = "";

  if (settings) {
    const basePrompt =
      settings.voiceGender === "male"
        ? PSYCHOLOGICAL_SUPPORT_BASE_PROMPT_MALE
        : PSYCHOLOGICAL_SUPPORT_BASE_PROMPT_FEMALE;

    prompt += basePrompt.replace(/%VOICE_NAME%/g, settings.voiceName);
  } else {
    prompt += PSYCHOLOGICAL_SUPPORT_BASE_PROMPT_MALE.replace(
      /%VOICE_NAME%/g,
      "Незнакомец",
    );
  }

  prompt += `\n\n**ВАЖНЫЕ ПРАВИЛА ФОРМАТИРОВАНИЯ ОТВЕТА:**
- НЕ ИСПОЛЬЗУЙ символы #, *, -, =, >, < для форматирования текста
- НЕ ИСПОЛЬЗУЙ маркированные списки или нумерацию
- НЕ ВЫДЕЛЯЙ текст жирным, курсивом или подчеркиванием
- НЕ СТАВЬ звездочки, решетки или другие символы
- Отвечай обычным сплошным текстом, как в разговоре
- Используй только пробелы и точки для разделения предложений
- Пиши естественно, как живой человек в устной беседе`;

  return prompt;
}