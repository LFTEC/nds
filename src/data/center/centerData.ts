import { detectCategory, detectResult, indicator } from "@/generated/prisma";
export interface indicatingData {
  id: string,
  batchNo: string,
  vender: string,
  exhibitionDate: Date,
  exhibitionId: string,
  startDate: Date | null,
  finishDate: Date | null,
  indicatingItems: number,
  finishedItems: number
}

export interface categoryWithIndicators extends detectCategory {
  detectResults: detectResult[],
  indicators: indicator[],
  categoryName: string,
  categoryDescription: string,
  serialNo: number
}