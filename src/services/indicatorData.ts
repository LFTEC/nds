import { z } from "zod";
import { Prisma } from "@/generated/prisma";

export const indicatorSchema = z.object({
  id: z.coerce.number(),
  categoryId: z.coerce.number(),
  name: z.string({ invalid_type_error: "请输入名称" }).min(1, "请输入名称"),
  description: z
    .string({ invalid_type_error: "请输入描述" })
    .min(1, "请输入描述"),
  serialNo: z.coerce.number().gt(0, "请输入一个大于0的序列号"),
  noDetection: z.coerce.boolean(),
  type: z.enum(["T", "C", "D", "B"], {
    invalid_type_error: "请选择一个检测类型",
  }),
  hasSuggestionText: z.boolean(),
  unit: z.string({ invalid_type_error: "请输入检验指标的单位" }),
  suggestionText: z.string().nullable(),
  comboId: z.coerce.number().nullable(),
  thresholdLow: z
    .custom<Prisma.Decimal>()
    .nullable()
    .transform((value) => {
      if (value instanceof Prisma.Decimal) return value.toString();
      return value;
    }),
  thresholdHigh: z
    .custom<Prisma.Decimal>()
    .nullable()
    .transform((value) => {
      if (value instanceof Prisma.Decimal) return value.toString();
      return value;
    }),
});
