'use server'
import { registrySchema, formSchema } from "@/data/registry/registryData";
import { nori } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { errorState } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import {format} from 'date-fns';

export async function getTotalPages(query: string) {
  try {
    const result = await prisma.nori.count({
      where: {
        OR: [
          {
            batchNo: { startsWith: query },
          },
          {
            vendor: { startsWith: query },
          },
          {
            exhibitionId: { startsWith: query },
          },
          {
            maritime: { startsWith: query },
          },
          {
            boxQuantity: { gte: Number(query) },
          },
        ],
        startDate: { not: null}
      }
    });

    return result;
  } catch (error) {
    console.error("查询紫菜清单总行数时发生异常", error);
    throw new Error("查询紫菜清单总行数时发生异常");
  }
}

export async function getNoriListByFilter(query: string, currentPage: number): Promise<nori[]> {
  try {
    const noriList = await prisma.nori.findMany({
      where: {
        OR: [
          {
            batchNo: { startsWith: query },
          },
          {
            vendor: { startsWith: query },
          },
          {
            exhibitionId: { startsWith: query },
          },
          {
            maritime: { startsWith: query },
          },
          {
            boxQuantity: { gte: Number(query) },
          },
        ],
        startDate: null
      },
      skip: (currentPage - 1) * 20,
      take: 20,
      orderBy: [{batchNo: "asc"}]
    });

    return noriList;
  } catch (error) {
    console.error("查询紫菜清单时发生异常", error);
    throw new Error("查询紫菜清单时发生异常");
  }
}



export async function updateNori(id: string|undefined, privState: errorState, data: z.infer<typeof formSchema>):Promise<errorState> {

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  try{
    if(id){
      await prisma.nori.update({
        where: {id: id},
        data: {
          vendor: data.vendor,
          exhibitionDate: new Date(format(data.exhibitionDate,"yyyy-MM-dd")),
          exhibitionId: data.exhibitionId,
          productionDate: data.productionDate ? new Date(format(data.productionDate,"yyyy-MM-dd")): null,
          maritime: data.maritime,
          boxQuantity: data.boxQuantity,          
        }
      });
    } else {
      const d = new Date();
      const ym = d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
      const prefix = 'JY';
      const maxBatch = await prisma.nori.aggregate({
        _max: {batchNo: true},
        where: {batchNo: {startsWith: prefix + ym}}
      });

      let currentBatchNo: string;
      if(!maxBatch._max.batchNo) {
        currentBatchNo = prefix + ym + "0001";
      } else {
        const serial = Number(maxBatch._max.batchNo.slice(-4)) + 1;
        currentBatchNo = prefix + ym + String(serial).padStart(4,'0');
      }

      const session = await auth();
      
      if(!session?.user?.id) {
        throw new Error("用户未登录");
      }

      await prisma.nori.create({
        data: {
          batchNo: currentBatchNo,
          vendor: data.vendor,
          exhibitionDate: new Date(format(data.exhibitionDate,"yyyy-MM-dd")),
          exhibitionId: data.exhibitionId,
          productionDate: data.productionDate ? new Date(format(data.productionDate,"yyyy-MM-dd")): null,
          boxQuantity: data.boxQuantity,
          maritime: data.maritime,
          creatorId: session?.user?.id,
          createDate: new Date()
        }
      })
    }

    revalidatePath("/main/registry")
    return {state: "success"};
  } catch(error){
    return {state:"error", message:"更新紫菜信息时发生异常" + error.message};
  }
}
