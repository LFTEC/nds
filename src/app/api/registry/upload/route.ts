import * as xlsx from "xlsx";
import { NextResponse } from "next/server";
import { errorState } from "@/lib/utils";
import { updateNori } from "@/services/noriService";
import { formSchema } from "@/data/registry/registryData";
import { revalidatePath } from "next/cache";

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
    const formData = await request.formData();
    const file = formData.get("excel") as File;
    if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") 
      return NextResponse.json<errorState>({state: "error", message: "请传入正确的excel文件"});

    const arrayBuffer = await file.arrayBuffer();
    const workbook = xlsx.read(arrayBuffer, {type: "array", cellDates: true, cellText: true});
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json<excelDataType>(sheet, {header: ["vendor", "exhibitionDate", "exhibitionId", "productionDate", "maritime", "boxQuantity"], raw: false, range: 1});

    for(const nori of data) {
      const state = await updateNori(undefined, {state: "success"}, formSchema.parse(nori) );
      if(state.state === "error") 
        throw new Error(state.message??"");
    }

    return NextResponse.json<errorState>({state:"success"});
    
  } catch (error: any) {
    console.error(error);
    return NextResponse.json<errorState>({state:"error", message:error.message});
  }
}