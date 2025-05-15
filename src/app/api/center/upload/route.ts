import { NextResponse } from "next/server";
import { updatePicture } from "@/services/centerService";
import { errorState } from "@/lib/utils";

export const config = {
  api: {
    bodyParser: false
  }
}

export async function POST(request: Request) {
    try {
      const formData = await request.formData();
    
    const noriId = formData.get("nori_id") as string;
    const categoryId = Number.parseInt(formData.get("category_id") as string);
    const file = formData.get("file") as File;

    await updatePicture(noriId, categoryId, file);
    return NextResponse.json<errorState>({state: "success"});
    } catch (error:any) {
      return NextResponse.json<errorState>({state: "error", message: error.message});
    }
    

}