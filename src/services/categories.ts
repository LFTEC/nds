'use server'
import prisma from "@/lib/prisma";
import { category } from "@/generated/prisma";

export async function allCategories(): Promise<category[]> {
  return await prisma.category.findMany({orderBy: {serialNo: "asc"}});
}


export async function setInvisible({id, invisible}: {id:number, invisible: boolean}) {
  try {
    const cate = await prisma.category.findUniqueOrThrow({where: {id: id}});
    cate.invisible = invisible;
    
    await prisma.category.update({where: {id: cate.id}, data: {invisible: cate.invisible}});
  } catch (error) {
    
  }
}