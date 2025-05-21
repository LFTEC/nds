"use server";
import { formSchema, summarySchema } from "@/data/registry/registryData";
import prisma, { isPrismaClientKnownError } from "@/lib/prisma";
import { errorState } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { Prisma, nori } from "generated/prisma";
import logger from "@/lib/logger";

interface registryDataType {
  nori_id: string;
  vendor: string;
  exhibition_date: Date;
  exhibition_id: string;
  production_date: Date | null;
  maritime: string | null;
  box_quantity: number | null;
  batch_no: string;
  create_date: Date;
  user_id: string;
}

interface indicatingDataType {
  nori_id: string;
  vendor: string;
  exhibition_date: Date;
  exhibition_id: string;
  batch_no: string;
  detection_date: Date;
  complete_date: Date;
}

export async function getTotalPages(query: string) {
  try {
    query = query.replaceAll("*", "%");

    const result = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT count(*) FROM t_nori_info
      WHERE detection_date is null
      and (batch_no ILIKE ${`%${query}%`}
      or vendor ILIKE ${`%${query}%`}
      or exhibition_date::text ILIKE ${`%${query}%`}
      or exhibition_id ILIKE ${`%${query}%`}
      or production_date::text ILIKE ${`%${query}%`}
      or maritime ILIKE ${`%${query}%`}
      or box_quantity::text ILIKE ${`%${query}%`}
      or create_date::text ILIKE ${`%${query}%`}
      )
    `;

    return Math.ceil(Number(result[0].count) / 20);
  } catch (error) {
    console.error("查询紫菜清单时发生异常", error);
    throw new Error("查询紫菜清单时发生异常");
  }
}

export async function getNoriListByFilter(query: string, currentPage: number) {
  try {
    query = query.replaceAll("*", "%");

    const result = await prisma.$queryRaw<registryDataType[]>`
      SELECT * FROM t_nori_info
      WHERE detection_date is null
      and (batch_no ILIKE ${`%${query}%`}
      or vendor ILIKE ${`%${query}%`}
      or exhibition_date::text ILIKE ${`%${query}%`}
      or exhibition_id ILIKE ${`%${query}%`}
      or production_date::text ILIKE ${`%${query}%`}
      or maritime ILIKE ${`%${query}%`}
      or box_quantity::text ILIKE ${`%${query}%`}
      or create_date::text ILIKE ${`%${query}%`}
      )
      order by batch_no
      limit 20 offset ${(currentPage - 1) * 20}
    `;

    const noriList = result.map<nori>((r) => ({
      id: r.nori_id,
      vendor: r.vendor,
      exhibitionDate: r.exhibition_date,
      exhibitionId: r.exhibition_id,
      productionDate: r.production_date,
      maritime: r.maritime,
      boxQuantity: r.box_quantity,
      batchNo: r.batch_no,
      createDate: r.create_date,
      creatorId: r.user_id,
      finishDate: null,
      level: null,
      startDate: null,
      summary: null,
    }));

    return noriList;
  } catch (error) {
    console.error("查询紫菜清单时发生异常", error);
    throw new Error("查询紫菜清单时发生异常");
  }
}

export async function getNoriDataById(id: string) {
  try {
    return await prisma.nori.findUnique({ where: { id: id } });
  } catch (error) {
    console.error("查询紫菜信息时发生错误", error);
  }
}

export const databaseCreateNori = async (
  data: z.infer<typeof formSchema>[]
) => {
  const dd = new Date();
  const ym =
    dd.getFullYear() +
    String(dd.getMonth() + 1).padStart(2, "0") +
    String(dd.getDate()).padStart(2, "0");
  const prefix = "JY";

  const maxBatch = await prisma.nori.aggregate({
    _max: { batchNo: true },
    where: { batchNo: { startsWith: prefix + ym } },
  });

  let serialNo: number;
  if (!maxBatch._max.batchNo) {
    serialNo = 1;
  } else {
    serialNo = Number(maxBatch._max.batchNo.slice(-4)) + 1;
  }

  const user = (await auth())?.user;
  if (user === undefined) {
    throw new Error("用户未登录");
  }

  const createData = data.map<Prisma.noriCreateManyInput>((nori) => ({
    ...nori,
    exhibitionDate: new Date(format(nori.exhibitionDate, "yyyy-MM-dd")),
    productionDate: nori.productionDate ? new Date(format(nori.productionDate, "yyyy-MM-dd")): null,
    batchNo: prefix + ym + String(serialNo++).padStart(4, "0"),
    creatorId: user.id!,
    createDate: new Date(),
  }));

  await prisma.nori.createMany({
    data: createData,
  });
};

export const databaseUpdateNori = async(noriId: string, data: z.infer<typeof formSchema>) =>{
  await prisma.nori.update({
    where: {id: noriId},
    data: {
      vendor: data.vendor,
      exhibitionDate: new Date(format(data.exhibitionDate, "yyyy-MM-dd")),
      exhibitionId: data.exhibitionId,
      productionDate: data.productionDate
        ? new Date(format(data.productionDate, "yyyy-MM-dd"))
        : null,
      maritime: data.maritime,
      boxQuantity: data.boxQuantity,
    }
  })
}

export async function updateNori(
  id: string | undefined,
  privState: errorState,
  data: z.infer<typeof formSchema>
): Promise<errorState> {

  try {
    logger.debug("进行紫菜样品的创建或更新工作", {data: data, id: id});

    if (id) {
      await databaseUpdateNori(id, data);
    } else {
      await databaseCreateNori([data]);
    }

    revalidatePath("/main/registry");
    return { state: "success" };
  } catch (error) {
    logger.error("进行紫菜样品的创建或更新工作时出错", {error});

    if(isPrismaClientKnownError(error)) {
      if(error.code === "P2002") {
        return {state: "error", message: "传入重复的样品信息"};
      } else if(error.code === "P2001") {
        return {state: "error", message: "更新的紫菜样品信息不存在"};
      }
    }

    return { state: "error", message: "更新紫菜信息时发生异常" };
  }
}

export async function deleteNori(id: string): Promise<errorState> {
  try {
    await prisma.nori.delete({
      where: { id: id },
    });

    revalidatePath("/main/registry");
    redirect("/main/registry");
  } catch (error) {
    console.error(error);

    return { state: "error", message: `删除待检项目${id}时发生异常` };
  }
}

export async function getIndicatingNoriPages(query: string) {
  query = query.replaceAll("*", "%");

  const result = await prisma.$queryRaw<{ count: bigint }[]>`
    select count(*)
    from t_nori_info
    where complete_date is null
    and (
      batch_no ILIKE ${`%${query}%`}
      or vendor ILIKE ${`%${query}%`}
      or exhibition_date::text ILIKE ${`%${query}%`}
      or exhibition_id ILIKE ${`%${query}%`}
      or detection_date::text ILIKE ${`%${query}%`}
    )
  `;

  return Math.ceil(Number(result[0].count) / 20);
}

export async function getIndicatingNoris(query: string, currentPage: number) {
  try {
    query = query.replaceAll("*", "%");

    const result = await prisma.$queryRaw<indicatingDataType[]>`
    select nori_id, vendor, exhibition_date, exhibition_id, batch_no, detection_date, complete_date
    from t_nori_info
    where complete_date is null
    and (
      batch_no ILIKE ${`%${query}%`}
      or vendor ILIKE ${`%${query}%`}
      or exhibition_date::text ILIKE ${`%${query}%`}
      or exhibition_id ILIKE ${`%${query}%`}
      or detection_date::text ILIKE ${`%${query}%`}
    )
    order by batch_no
    limit 20 offset ${(currentPage - 1) * 20}
  `;

    const noriList = Promise.all(
      result.map(async (nori) => {
        const detections = await prisma.detectResult.findMany({
          where: {
            noriId: nori.nori_id,
          },
        });

        return {
          id: nori.nori_id,
          batchNo: nori.batch_no,
          vendor: nori.vendor,
          exhibitionDate: nori.exhibition_date,
          exhibitionId: nori.exhibition_id,
          startDate: nori.detection_date,
          finishDate: nori.complete_date,
          detections: detections,
        };
      })
    );

    return noriList;
  } catch (error) {
    console.error("查询待检清单时发生异常", error);
    throw new Error("查询待检清单时发生异常");
  }
}

export async function getReportsTotalPages(query: string) {
  query = query.replaceAll("*", "%");

  const result: any = await prisma.$queryRaw`
    select count(*)
    from t_nori_info
    where complete_date is not null
    and (
      batch_no ILIKE ${`%${query}%`}
      or vendor ILIKE ${`%${query}%`}
      or exhibition_date::text ILIKE ${`%${query}%`}
      or exhibition_id ILIKE ${`%${query}%`}
      or create_date::text ILIKE ${`%${query}%`}
      or detection_date::text ILIKE ${`%${query}%`}
      or complete_date::text ILIKE ${`%${query}%`}
    )
  `;

  return Math.ceil(Number(result[0].count) / 20);
}

export async function getReports(query: string, currentPage: number) {
  query = query.replaceAll("*", "%");

  const result: any = await prisma.$queryRaw`
    select nori_id
    from t_nori_info
    where complete_date is not null
    and (
      batch_no ILIKE ${`%${query}%`}
      or vendor ILIKE ${`%${query}%`}
      or exhibition_date::text ILIKE ${`%${query}%`}
      or exhibition_id ILIKE ${`%${query}%`}
      or create_date::text ILIKE ${`%${query}%`}
      or detection_date::text ILIKE ${`%${query}%`}
      or complete_date::text ILIKE ${`%${query}%`}
    )
    order by batch_no
    limit 20 offset ${(currentPage - 1) * 20}
  `;

  const noriList = await prisma.nori.findMany({
    select: {
      id: true,
      batchNo: true,
      vendor: true,
      exhibitionDate: true,
      exhibitionId: true,
      detections: true,
      createDate: true,
      startDate: true,
      finishDate: true,
    },
    where: {
      OR: result.map(({ nori_id }: { nori_id: string }) => ({
        id: nori_id,
      })),
    },
    orderBy: {
      batchNo: "asc",
    },
  });

  return noriList.map((nori) => {
    const report = {
      ...nori,
      allIndicators: nori.detections.length,
      finishedIndicators: 0,
    };

    nori.detections.forEach((d) => {
      if (d.result === "Y") {
        report.finishedIndicators++;
      }
    });

    return report;
  });
}

export async function getIndicatingNoriById(id: string) {
  return await prisma.nori.findUniqueOrThrow({
    include: {
      categories: { include: { category: true } },
      detections: {
        include: {
          indicator: { include: { combo: { include: { items: true } } } },
        },
      },
    },
    where: { id: id },
  });
}

export async function complete(
  id: string,
  data: z.infer<typeof summarySchema>
): Promise<errorState> {
  try {
    await prisma.nori.update({
      data: {
        finishDate: new Date(format(new Date(), "yyyy-MM-dd")),
        level: data.level,
        summary: data.summary,
      },
      where: { id: id },
    });
  } catch (error) {
    console.error("完成检验时发生异常", error);
    return { state: "error", message: "完成检验时发生异常" };
  }

  revalidatePath("/main/center");
  redirect("/main/center");
}
