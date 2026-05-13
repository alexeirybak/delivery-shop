import { DictationSettings } from "@/store/dictationSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { DICTATION_BASE_PROMPT } from "./dictationBase";

export function getDictationPrompt(
  settings?: DictationSettings,
): string {
  let prompt = FORMATTING_RULES + "\n\n" + DICTATION_BASE_PROMPT;

  if (settings) {
    prompt += `\n\n**ЯЗЫК:** ${settings.language}\n`;
  }

  return prompt;
}