"use server";

import {
  categoryWithIndicators,
  indicatingData,
} from "@/data/center/centerData";
import { getIndicatingNoriById, getIndicatingNoris } from "./noriService";
import { getAllValidIndicatorQty } from "./indicatorService";
import {
  category,
  combo,
  comboItem,
  detectResult,
  indicator
} from "generated/prisma";
import { allCategoriesWithIndicator } from "./categories";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { z } from "zod";
import { formSchema } from "@/data/center/centerData";
import { errorState } from "@/lib/utils";
import { auth } from "@/auth";
import { Prisma } from "generated/prisma/client";
import { redirect } from "next/navigation";

export async function getIndicatingList(
  query: string,
  currentPage: number
): Promise<indicatingData[]> {
  const noriList = await getIndicatingNoris(query, currentPage);

  const dataList: indicatingData[] = await Promise.all(
    noriList.map(async (nori) => {
      const data: indicatingData = {
        id: nori.id,
        batchNo: nori.batchNo,
        vender: nori.vendor,
        exhibitionDate: nori.exhibitionDate,
        exhibitionId: nori.exhibitionId,
        finishDate: nori.finishDate,
        startDate: nori.startDate,
        finishedItems: 0,
        indicatingItems: 0,
      };

      if (nori.detections.length > 0) {
        nori.detections.map((indicator) => {
          if (indicator.result === "N") data.indicatingItems++;
          else data.finishedItems++;
        });
      } else {
        data.indicatingItems = await getAllValidIndicatorQty();
      }

      return data;
    })
  );

  return dataList;
}

export async function getCorrespondingCategories(id: string) {
  try {
    const nori = await getIndicatingNoriById(id);

    const cCates: categoryWithIndicators[] = nori.categories.map((cate) => {
      const results: detectResult[] = [];
      const indicators: (indicator & {
        combo: (combo & { items: comboItem[] }) | null;
      })[] = [];
      
      nori.detections.sort((a,b)=>a.indicator.serialNo - b.indicator.serialNo);
      nori.detections.forEach((d) => {
        if (d.indicator.categoryId === cate.categoryId) {
          results.push(d);
          indicators.push(d.indicator);
        }
      });
      return {
        ...cate,
        indicators: indicators,
        detectResults: results,
        categoryName: cate.category.name,
        categoryDescription: cate.category.description,
        serialNo: cate.category.serialNo,
        hasPic: cate.category.hasPic
      };
    });
    return cCates;
  } catch (error) {
    console.error(error);
    throw new Error("获取检验样本对应的检验清单时出错");
  }
}

export const startIndicate = async (noriId: string) => {
  const start = await prisma.nori.aggregate({
    _count: true,
    where: { id: noriId, NOT: { startDate: null } },
  });

  if (start._count == 0) {
    const categories = await allCategoriesWithIndicator();

    const validCategories: category[] = [];
    const validIndicators: indicator[] = [];
    categories.forEach((category) => {
      if (!category.invisible) {
        validCategories.push(category);

        category.indicators.forEach((indicator) => {
          if (!indicator.noDetection) {
            validIndicators.push(indicator);
          }
        });
      }
    });

    await prisma.$transaction(
      async (tx) => {
        await tx.detectCategory.createMany({
          data: validCategories.map((category) => ({
            noriId: noriId,
            categoryId: category.id,
            noDetection: false,
          })),
        });

        await tx.detectResult.createMany({
          data: validIndicators.map((indicator) => ({
            noriId: noriId,
            indicatorId: indicator.id,
            result: "N",
            suggestionText: indicator.hasSuggestionText
              ? indicator.suggestionText
              : null,
            createDate: new Date(format(new Date(), "yyyy-MM-dd")),
          })),
        });

        await tx.nori.update({
          data: { startDate: new Date(format(new Date(), "yyyy-MM-dd")) },
          where: { id: noriId },
        });
      },
      { maxWait: 5000, timeout: 10000 }
    );
  }

  const categories = await getCorrespondingCategories(noriId);
  categories.sort((a, b) => {
    return a.serialNo - b.serialNo;
  });

  redirect(`/main/center/${noriId}/forms/category-${categories[0].categoryId}`);
};

export async function updateIndicateResult(
  data: z.infer<typeof formSchema>
): Promise<errorState> {
  try {
    const result = await prisma.detectResult.findUniqueOrThrow({
      include: {
        indicator: { include: { combo: { include: { items: true } } } },
      },
      where: {
        noriId_indicatorId: {
          noriId: data.noriId,
          indicatorId: data.indicatorId,
        },
      },
    });

    const session = await auth();
    if (!session?.user?.id)
      return { state: "error", message: "用户未登录，请登录后再操作" };

    const updateData: Prisma.detectResultUncheckedUpdateInput = {};

    if (data.noDetection && result.result !== "I") {
      //设置该指标不检测
      updateData.result = "I";
      updateData.inspectDate = new Date(format(new Date(), "yyyy-MM-dd"));
      updateData.inspectorId = session.user.id;
    } else {
      if (result.indicator.type === "B") {
        if (data.boolData != null) {
          updateData.result = "Y";
          updateData.boolData = data.boolData;
          updateData.suggestionText = data.suggestionText;
          updateData.inspectorId = session.user.id;
          updateData.inspectDate = new Date(format(new Date(), "yyyy-MM-dd"));
        } else {
          updateData.result = "N";
          updateData.boolData = null;
          updateData.suggestionText = data.suggestionText;
          updateData.inspectorId = null;
          updateData.inspectDate = null;
        }
      } else if (result.indicator.type === "D") {
        if (
          data.numData == null ||
          data.numData.trim() === "" ||
          data.numData === undefined
        ) {
          updateData.result = "N";
          updateData.numData = null;
          updateData.suggestionText = data.suggestionText;
          updateData.inspectorId = null;
          updateData.inspectDate = null;
        } else {
          updateData.result = "Y";
          updateData.numData = data.numData;
          updateData.suggestionText = data.suggestionText;
          updateData.inspectorId = session.user.id;
          updateData.inspectDate = new Date(format(new Date(), "yyyy-MM-dd"));
        }
      } else if (result.indicator.type === "T") {
        if (
          data.stringData == null ||
          data.stringData.trim() === "" ||
          data.stringData === undefined
        ) {
          updateData.result = "N";
          updateData.stringData = null;
          updateData.suggestionText = data.suggestionText;
          updateData.inspectorId = null;
          updateData.inspectDate = null;
        } else {
          updateData.result = "Y";
          updateData.stringData = data.stringData;
          updateData.suggestionText = data.suggestionText;
          updateData.inspectorId = session.user.id;
          updateData.inspectDate = new Date(format(new Date(), "yyyy-MM-dd"));
        }
      } else if (result.indicator.type === "C") {
        if (data.comboItemData == null || data.comboItemData === undefined) {
          updateData.result = "N";
          updateData.comboItemData = null;
          updateData.suggestionText = data.suggestionText;
          updateData.inspectorId = null;
          updateData.inspectDate = null;
        } else {
          if (
            result.indicator.combo?.items.find(
              (item) => item.id === data.comboItemData
            )
          ) {
            updateData.result = "Y";
            updateData.comboItemData = data.comboItemData;
            updateData.suggestionText = data.suggestionText;
            updateData.inspectorId = session.user.id;
            updateData.inspectDate = new Date(format(new Date(), "yyyy-MM-dd"));
          } else {
            return { state: "error", message: "传入的选择项不存在"  };
          }
        }
      }
    }

    await prisma.detectResult.update({
      data: updateData,
      where: {
        noriId_indicatorId: {
          noriId: data.noriId,
          indicatorId: data.indicatorId,
        },
      },
    });

    return { state: "success" };
  } catch (error) {
    console.error(error);
    return { state: "error", message: "更新数据时发生异常" };
  }
}
