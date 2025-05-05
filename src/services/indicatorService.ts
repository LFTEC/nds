'use server'
import prisma from "@/lib/prisma";
import type { indicator } from "@/generated/prisma";
import type { errorState } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { indicatorSchema } from "./indicatorData";
import {z} from 'zod';

export async function getIndicatorById(id: number): Promise<z.infer<typeof indicatorSchema>> {
  try {
    const parsed = indicatorSchema.safeParse(await prisma.indicator.findUniqueOrThrow({where: {id: id}}));
    if(parsed.success) {
      return parsed.data;
    } else {
      console.log(parsed.error.flatten().fieldErrors);
      throw new Error("error");
    }
  }
  catch (error) {
    throw new Error("查询检验指标时发生异常");
  }
}

export async function createIndicator(prevState: errorState, data: z.infer<typeof indicatorSchema>): Promise<errorState> {
  try{
    const parsedData = indicatorSchema.safeParse(data);
    if(parsedData.success) {
      await prisma.indicator.create({
        data: {
          name: parsedData.data.name,
          description: parsedData.data.description,
          serialNo: parsedData.data.serialNo,
          noDetection: parsedData.data.noDetection,
          hasSuggestionText: parsedData.data.hasSuggestionText,
          thresholdHigh: parsedData.data.thresholdHigh,
          thresholdLow: parsedData.data.thresholdLow,
          unit: parsedData.data.unit,
          suggestionText: parsedData.data.suggestionText,
          type: parsedData.data.type,
          comboId: parsedData.data.comboId,
          categoryId: parsedData.data.categoryId
        }
      });
    } else {
      return {state: "error", message: "创建指标时发生异常，传入的数据无法解析"};
    }

    

    revalidatePath(`/main/categories/${data.categoryId}/indicators`);
    return {state: "success"};
  } catch(error) {
    return {state: "error", message: "创建指标时发生异常"};
  }
}

export async function updateIndicator(id: number, prevState: errorState, data: z.infer<typeof indicatorSchema> ): Promise<errorState> {
  try{
    const indData = await prisma.indicator.findUniqueOrThrow({
      where: {
        id: id
      }
    });

    await prisma.indicator.update({
      data: {
        name: data.name,
        description: data.description,
        serialNo: data.serialNo,
        noDetection: data.noDetection,
        hasSuggestionText: data.hasSuggestionText,
        thresholdHigh: data.thresholdHigh,
        thresholdLow: data.thresholdLow,
        unit: data.unit,
        suggestionText: data.suggestionText,
        //comboId不能改
      },
      where: {
        id: id
      }
    });

    revalidatePath(`/main/categories/${indData.categoryId}/indicators`);
    return {state: "success"};

  } catch (error){
    console.log(error);
    return {state: "error", message: "更新指标时发生异常"};
  }
}

export async function getAllValidIndicators() {

}

export async function getAllValidIndicatorQty() {
  try{
    return await prisma.indicator.count({
      where: {noDetection: false}
    });
  } catch (error){
    console.log("获取指标总量时发生异常", error);
    throw new Error("获取指标总量时发生异常");
  }
}