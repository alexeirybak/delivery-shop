import { TranscriptionSettings } from "@/store/transcriptionSettingsStore";
import { FORMATTING_RULES } from "../../formattingRules/formattingRules";
import { TRANSCRIPTION_BASE_PROMPT } from "./transcriptionBase";

export function getTranscriptionPrompt(settings?: TranscriptionSettings): string {
  let prompt = FORMATTING_RULES + "\n\n" + TRANSCRIPTION_BASE_PROMPT;

  if (settings) {
    prompt += `\n\n**ЯЗЫК АУДИО:** ${settings.language}\n`;
  }

  return prompt;
}