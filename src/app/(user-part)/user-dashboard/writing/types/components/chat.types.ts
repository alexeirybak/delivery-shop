import { GenerationMode} from "../../../types";

export type WritingMode = Extract<
  GenerationMode,
  "textbooks" | "essay" | "test" | "coursework" | "report" | "thesis"
>;
