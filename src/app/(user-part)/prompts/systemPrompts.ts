import { IMPROVE_PROMPT } from "./simpleActions/improve";
import { CONTINUE_PROMPT } from "./simpleActions/continue";
import { SUMMARIZE_PROMPT } from "./simpleActions/summarize";
import { EXPAND_PROMPT } from "./simpleActions/expand";
import { SIMPLIFY_PROMPT } from "./simpleActions/simplify";
import { TRANSLATE_PROMPT } from "./simpleActions/translate";
import { GENERATE_PROMPT } from "./simpleActions/generate";
import { EXPLAIN_PROMPT } from "./simpleActions/explain";
import { DEFAULT_PROMPT } from "./simpleActions/default";
import { PRESENTATION_PROMPT } from "./educationPrompts/presentation";
import { CHAT_SCIENTIST_PROMPT } from "./scientificArticlePrompts/chat-science/chat-science";

export const SYSTEM_PROMPTS: Record<string, string> = {
  improve: IMPROVE_PROMPT,
  continue: CONTINUE_PROMPT,
  summarize: SUMMARIZE_PROMPT,
  expand: EXPAND_PROMPT,
  simplify: SIMPLIFY_PROMPT,
  translate: TRANSLATE_PROMPT,
  generate: GENERATE_PROMPT,
  explain: EXPLAIN_PROMPT,
  chat_scientist: CHAT_SCIENTIST_PROMPT,
  presentation: PRESENTATION_PROMPT,
  custom: DEFAULT_PROMPT, 
};

export type ActionOrMode = keyof typeof SYSTEM_PROMPTS;

export function getSystemPrompt(key?: string): string {
  return SYSTEM_PROMPTS[key as ActionOrMode] || DEFAULT_PROMPT;
}