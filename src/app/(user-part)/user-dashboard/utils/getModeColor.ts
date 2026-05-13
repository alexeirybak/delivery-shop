import { modeConfig } from "@/utils/modeConfig";

export const getModeColor = (mode: string): string =>
  modeConfig[mode]?.color ?? "#888";