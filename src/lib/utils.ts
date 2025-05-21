import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface errorState {
  state: "error" | "warning" | "success";
  message?: string | null;
  data?: any;
}

export const TransformIndicatorType = (indType: string | undefined) => {
  if (!indType) return;

  switch (indType) {
    case "T":
      return "文本型";
    case "C":
      return "选择型";
    case "D":
      return "数值型";
    case "B":
      return "布尔型";
    default:
      console.error(`类型${indType}不存在`);
      throw new Error(`类型${indType}不存在`);
  }
}