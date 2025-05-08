import { detectCategory, detectResult, indicator, combo, comboItem } from "generated/prisma";
import { z } from "zod";

export interface indicatingData {
  id: string;
  batchNo: string;
  vender: string;
  exhibitionDate: Date;
  exhibitionId: string;
  startDate: Date | null;
  finishDate: Date | null;
  indicatingItems: number;
  finishedItems: number;
}

export interface categoryWithIndicators extends detectCategory {
  detectResults: detectResult[];
  indicators: (indicator & {combo: combo & {items: comboItem[]} | null})[];
  categoryName: string;
  categoryDescription: string;
  serialNo: number;
}

export const formSchema = z.object({
  noriId: z.string({ invalid_type_error: "样品编号丢失" }),
  indicatorId: z.number({ invalid_type_error: "指标编号丢失" }),
  noDetection: z.boolean({ invalid_type_error: "缺少是否检测标记" }),
  stringData: z.string().nullable(),
  boolData: z.boolean().nullable(),
  numData: z
    .string()
    .refine((value) => /^[0-9]*(\.[0-9]{1,2})?$/.test(value), {
      message: "必须为数字且最多两位小数",
    })
    .nullable(),
  comboItemData: z.coerce.number().nullable(),
  suggestionText: z.string({ invalid_type_error: "请输入建议文本" }),
});
