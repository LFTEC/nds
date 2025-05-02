"use server";
import prisma from "@/lib/prisma";
import { category } from "@/generated/prisma";
import { errorState } from "@/lib/utils";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function allCategories(): Promise<category[]> {
  return await prisma.category.findMany({ orderBy: { serialNo: "asc" } });
}

const formSchema = z
  .object({
    id: z.number(),
    name: z.coerce.string({ invalid_type_error: "请输入类别名称" }),
    description: z.coerce.string({ invalid_type_error: "请输入类别描述" }),
  })
  .omit({ id: true });

export async function getCategoryById(id: number) {
  return await prisma.category.findUniqueOrThrow({
    where: { id: id },
    include: {
      indicators: {
        orderBy: [
          {
            noDetection: "asc"
          },
          {
            serialNo: "asc"
          }
        ],
      },
    },
  });
}

export async function setInvisible({
  id,
  invisible,
}: {
  id: number;
  invisible: boolean;
}): Promise<errorState> {
  try {
    const cate = await prisma.category.findUniqueOrThrow({ where: { id: id } });
    cate.invisible = invisible;

    await prisma.category.update({
      where: { id: cate.id },
      data: { invisible: cate.invisible },
    });
    return { state: "success" };
  } catch (error) {
    return { state: "error", message: `设置类别${id}时发生故障，请稍后再试` };
  }
}

export async function saveCategoryName(
  id: number,
  prevState: errorState,
  formData: FormData
): Promise<errorState> {
  try {
    const cate = await prisma.category.findUniqueOrThrow({ where: { id: id } });
    const { name, description } = formSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
    });

    await prisma.category.update({
      data: {
        name: name,
        description: description,
      },
      where: { id: id },
    });

    revalidatePath("/main/categories");
    redirect("/main/categories");
  } catch (error) {
    return { state: "error", message: "更新类别信息发生故障，请稍后再试" };
  }
}

export async function createCategory(
  prevState: errorState
): Promise<errorState> {
  try {
    let maxSerialNo = await prisma.category.aggregate({
      _max: { serialNo: true },
    });
    let maxNo = 1000;
    if ((maxSerialNo._max.serialNo ?? 0) >= 1000) {
      console.log("great than 1000");
      maxNo = (maxSerialNo._max.serialNo ?? 0) + 1;
    }

    console.log(maxSerialNo);
    console.log(maxNo);

    await prisma.category.create({
      data: {
        invisible: true,
        serialNo: maxNo,
        description: "新建检测类别",
        name: "新建检测类别",
      },
    });

    revalidatePath("/main/categories");
    redirect("/main/categories");
  } catch (error) {
    return { state: "error", message: "创建检测类别时发生故障，请稍后再试" };
  }
}
