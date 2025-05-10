import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IndicatingTable } from "@/ui/center/table";

import { SearchInput } from "@/ui/search-box";
import { getIndicatingNoriPages } from "@/services/noriService";
import { PaginationBox } from "@/ui/pagination";

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: number }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = searchParams?.page || 1;

  const totalPages = await getIndicatingNoriPages(query);
  

  return (
    <div className="flex grow gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <Card className="h-full flex-1 rounded-sm">
        <CardHeader>
          <CardTitle>检测中心</CardTitle>
          <CardDescription>
            对待检的紫菜产品进行各项检验工作，并最终生成紫菜等级评估及检验报告。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="border-b" />
          <div className="flex gap-4 mx-2 my-2">
            <SearchInput placeholder="查询待检样品清单" />
          </div>
          <IndicatingTable query={query} currentPage={page} />
          <PaginationBox totalPages={totalPages} />
        </CardContent>
      </Card>
    </div>
  );
}
