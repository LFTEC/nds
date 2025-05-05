import { categoryWithIndicators, indicatingData } from "@/data/center/centerData";
import { getIndicatingNoriById, getIndicatingNoris } from "./noriService";
import { getAllValidIndicatorQty } from "./indicatorService";
import { category, detectResult, indicator, nori } from "@/generated/prisma";
import { allCategoriesWithIndicator } from "./categories";
import prisma from "@/lib/prisma";
import {format} from 'date-fns';

export  async function getIndicatingList(query: string, currentPage: number):Promise<indicatingData[]> {
  const noriList = await getIndicatingNoris(query, currentPage);
  
  const dataList: indicatingData[] = await Promise.all(
    noriList.map(async nori=>{
      const data: indicatingData = {
        id: nori.id,
        batchNo: nori.batchNo,
        vender: nori.vendor,
        exhibitionDate: nori.exhibitionDate,
        exhibitionId: nori.exhibitionId,
        finishDate: nori.finishDate,
        startDate: nori.startDate,
        finishedItems: 0,
        indicatingItems: 0
      };

      if(nori.detections.length > 0) {
        nori.detections.map(indicator=>{
          if(indicator.result === "N") 
            data.indicatingItems++;
          else
            data.finishedItems++;
        });
      } else {
        data.indicatingItems = await getAllValidIndicatorQty();
      }

      return data;
    }));

  return dataList;
}

export async function getCorrespondingCategories(id: string) {
  try{
    const nori = await getIndicatingNoriById(id);
    if(nori.categories.length > 0) {
      const cCates: categoryWithIndicators[] = nori.categories.map(cate=>{
        const results: detectResult[] = [];
        const indicators: indicator[] = [];

        nori.detections.forEach(d=>{
          if(d.indicator.categoryId === cate.categoryId) {
            results.push(d);
            indicators.push(d.indicator);
          }
        })
        return {...cate,
          indicators: indicators,
          detectResults: results,
          categoryName: cate.category.name,
          categoryDescription: cate.category.description,
          serialNo: cate.category.serialNo
        };
      });
      return cCates;
    } else {
      await startIndicate(nori);
      return await getCorrespondingCategories(id);
    }
  } catch(error){
    console.error(error);
    throw new Error("获取检验样本对应的检验清单时出错");
  }
}

const startIndicate = async (nori: nori) => {
  const categories  = await allCategoriesWithIndicator();

  const validCategories: category[] = [];
  const validIndicators: indicator[] = [];
  categories.forEach(category=>{
    if(!category.invisible) {
      validCategories.push(category);

      category.indicators.forEach(indicator=>{
        if(!indicator.noDetection) {
          validIndicators.push(indicator);
        }
      })
    }
  });


  await prisma.detectCategory.createMany({
    data: validCategories.map(category=> ({
      noriId: nori.id,
      categoryId: category.id,
      noDetection: false
    }))
  });

  await prisma.detectResult.createMany({
    data: validIndicators.map(indicator=>({
      noriId: nori.id,
      indicatorId: indicator.id,
      result: 'N'
    }))
  });

  await prisma.nori.update({
    data: {startDate: new Date(format(new Date(),"yyyy-MM-dd"))},
    where: {id: nori.id}
  });
}