"use server";
import { formSchema, summarySchema } from "@/data/registry/registryData";
import { nori } from "generated/prisma";
import prisma from "@/lib/prisma";
import { errorState } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { format } from "date-fns";
import { redirect } from "next/navigation";

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

    const result = await prisma.$queryRaw<{ count: BigInt }[]>`
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

export async function updateNori(
  id: string | undefined,
  privState: errorState,
  data: z.infer<typeof formSchema>
): Promise<errorState> {
  try {
    if (id) {
      await prisma.nori.update({
        where: { id: id },
        data: {
          vendor: data.vendor,
          exhibitionDate: new Date(format(data.exhibitionDate, "yyyy-MM-dd")),
          exhibitionId: data.exhibitionId,
          productionDate: data.productionDate
            ? new Date(format(data.productionDate, "yyyy-MM-dd"))
            : null,
          maritime: data.maritime,
          boxQuantity: data.boxQuantity,
        },
      });
    } else {
      const d = new Date();
      const ym =
        d.getFullYear() +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0");
      const prefix = "JY";
      const maxBatch = await prisma.nori.aggregate({
        _max: { batchNo: true },
        where: { batchNo: { startsWith: prefix + ym } },
      });

      let currentBatchNo: string;
      if (!maxBatch._max.batchNo) {
        currentBatchNo = prefix + ym + "0001";
      } else {
        const serial = Number(maxBatch._max.batchNo.slice(-4)) + 1;
        currentBatchNo = prefix + ym + String(serial).padStart(4, "0");
      }

      const session = await auth();

      if (!session?.user?.id) {
        throw new Error("用户未登录");
      }

      await prisma.nori.create({
        data: {
          batchNo: currentBatchNo,
          vendor: data.vendor,
          exhibitionDate: new Date(format(data.exhibitionDate, "yyyy-MM-dd")),
          exhibitionId: data.exhibitionId,
          productionDate: data.productionDate
            ? new Date(format(data.productionDate, "yyyy-MM-dd"))
            : null,
          boxQuantity: data.boxQuantity,
          maritime: data.maritime,
          creatorId: session?.user?.id,
          createDate: new Date(),
        },
      });
    }

    revalidatePath("/main/registry");
    return { state: "success" };
  } catch (error) {
    console.error(error);
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
  query = query.replaceAll('*', '%');

  const result = await prisma.$queryRaw<{ count: BigInt }[]>`
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
    query = query.replaceAll('*','%');

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
    // const noriList = await prisma.nori.findMany({
    //   select: {
    //     id: true,
    //     batchNo: true,
    //     vendor: true,
    //     exhibitionDate: true,
    //     exhibitionId: true,
    //     startDate: true,
    //     finishDate: true,
    //     detections: true,
    //   },
    //   where: {
    //     finishDate: null,
    //     OR: [
    //       {
    //         batchNo: { startsWith: query },
    //       },
    //       {
    //         vendor: { startsWith: query },
    //       },
    //       {
    //         exhibitionId: { startsWith: query },
    //       },
    //     ],
    //   },
    // });

    return noriList;
  } catch (error) {
    console.error("查询待检清单时发生异常", error);
    throw new Error("查询待检清单时发生异常");
  }
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
