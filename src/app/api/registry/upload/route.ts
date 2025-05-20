import * as xlsx from "xlsx";
import { NextResponse } from "next/server";
import { errorState } from "@/lib/utils";
import { databaseCreateNori } from "@/services/noriService";
import { formSchema } from "@/data/registry/registryData";
import {Prisma} from "generated/prisma";
import {z} from "zod";
import logger from "@/lib/logger";

export const config = {
  api: {
    bodyParser: false
  }
}

export interface excelDataType {
  vendor: string,
  exhibitionDate: Date,
  exhibitionId: string,
  productionDate: Date|null,
  maritime: string|null,
  boxQuantity: number|null
}

export async function POST(request:Request) {
  try {
    logger.info("test");
    const formData = await request.formData();
    const file = formData.get("excel") as File;
    if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") 
      return NextResponse.json<errorState>({state: "error", message: "请传入正确的excel文件"});

    const arrayBuffer = await file.arrayBuffer();
    const workbook = xlsx.read(arrayBuffer, {type: "array", cellDates: true, cellText: true});
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json<excelDataType>(sheet, {header: ["vendor", "exhibitionDate", "exhibitionId", "productionDate", "maritime", "boxQuantity"], raw: false, range: 1});

    const noris = data.map<z.infer<typeof formSchema>>(nori=>(
      formSchema.parse(nori)
    ));

    await databaseCreateNori(noris);
    return NextResponse.json<errorState>({state:"success"});
    
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    if(prismaError) {
      if (prismaError.code === "P2002") {
        return NextResponse.json<errorState>({state: "error", message: "传入重复的样品信息"}, {status: 500});
      }
    }
    
    return NextResponse.json<errorState>({state:"error", message: "批量创建样品清单时发生异常"}, {status: 500});
  }
}