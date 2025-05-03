import { z } from "zod";
export type { nori as noriData } from "@/generated/prisma";

export const registrySchema = z.object({
  id: z.string(),
  vendor: z.string().min(1, "请录入厂家"),
  exhibitionDate: z.coerce.date({ invalid_type_error: "请输入参展日期" }),
  exhibitionId: z.string({ invalid_type_error: "请输入展台编号" }),
  productionDate: z.coerce
    .date({ invalid_type_error: "请输入产品生产日期" })
    .nullable(),
  maritime: z.string({ invalid_type_error: "请录入有效的海区" }).nullable(),
  boxQuantity: z.coerce
    .number({ invalid_type_error: "请录入箱数，必须为整数" })
    .nullable(),
  batchNo: z.string(),
  creatorId: z.string(),
  createDate: z.coerce.date(),
  startDate: z.coerce.date().nullable(),
  finishDate: z.coerce.date().nullable(),
  level: z.string().nullable(),
  summary: z.string().nullable(),
});

export const formSchema = registrySchema.omit({
  id: true,
  creatorId: true,
  createDate: true,
  startDate: true,
  finishDate: true,
  level: true,
  summary: true,
});
