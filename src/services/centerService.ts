import { indicatingData } from "@/data/center/centerData";
import { getIndicatingNoris } from "./noriService";
import { getAllValidIndicatorQty } from "./indicatorService";

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