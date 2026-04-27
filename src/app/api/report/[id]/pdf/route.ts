import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  const requestUrl = `http://localhost:8080/report?batchNo=${id}`;
  const range = request.headers.get("range");

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: range ? { Range: range } : {},
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch PDF " + id }, { status: response.status });
    }

    // 直接构造一个新的 NextResponse，透传 body 和 headers
    // 这样后端返回的 Content-Length 和 Content-Disposition 会原样传给浏览器
    const nextResponse = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers, 
    });

    // 补丁：确保浏览器知道可以进行多线程下载
    // 如果后端没返回这个头，手动加上
    if (!nextResponse.headers.has("Accept-Ranges")) {
      nextResponse.headers.set("Accept-Ranges", "bytes");
    }

    return nextResponse;

  } catch (error) {
    return NextResponse.json({ error: "Stream error" }, { status: 500 });
  }
}