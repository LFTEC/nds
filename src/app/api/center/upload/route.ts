import { NextResponse } from "next/server";
import { updatePicture } from "@/services/centerService";
import { errorState } from "@/lib/utils";
import logger from "@/lib/logger";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const noriId = formData.get("nori_id") as string;
    const categoryId = Number.parseInt(formData.get("category_id") as string);
    const file = formData.get("file") as File;

    await updatePicture(noriId, categoryId, file);
    return NextResponse.json<errorState>({ state: "success" });
  } catch (error: any) {
    logger.error(`上传检验类别的附件时出错`, {
      formData: await request.formData(),
      error: error
    });

    return NextResponse.json<errorState>({
      state: "error",
      message: "上传图片时发生错误，图片上传失败",
    }, {status: 500});
  }
}
