import { modeConfig } from "@/utils/modeConfig";

export const getModeIcon = (mode: string) =>
  modeConfig[mode]?.icon;