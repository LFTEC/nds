'use server'
import prisma from "@/lib/prisma";
import { category } from "@/generated/prisma";
import { errorState } from "@/lib/utils";

export async function allCategories(): Promise<category[]> {
  return await prisma.category.findMany({orderBy: {serialNo: "asc"}});
}


export async function setInvisible({id, invisible}: { id:number, invisible: boolean} ): Promise<errorState> {
  try {

    const cate = await prisma.category.findUniqueOrThrow({where: {id: id}});
    cate.invisible = invisible;
    
    await prisma.category.update({where: {id: cate.id}, data: {invisible: cate.invisible}});
    return {state: "success"};
  } catch (error) {
    return {state: "error", message: `设置类别${id}时发生故障，请稍后再试`};
  }
}