import { modeConfig } from "@/utils/modeConfig";

export const getModeLabel = (mode: string): string =>
  modeConfig[mode]?.label ?? mode;
