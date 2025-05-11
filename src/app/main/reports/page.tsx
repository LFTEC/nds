import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsTable } from "@/ui/reports/table";
import { getReportsTotalPages } from "@/services/noriService";
import { SearchInput } from "@/ui/search-box";
import { PaginationBox } from "@/ui/pagination";

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: number }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = searchParams?.page|| 1;

  const totalPages = await getReportsTotalPages(query);

  return (
    <div className="flex grow gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <Card className="h-full flex-1 rounded-sm">
        <CardHeader>
          <CardTitle>验单查询</CardTitle>
          <CardDescription>已完成检测的样品结果清单，可以在这里生成检验报告。</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="border-b"/>
          <div className="flex gap-4 mx-2 my-2">
            <SearchInput placeholder="查询检验报告" />
          </div>
          <ReportsTable query={query} currentPage={page} />
          <PaginationBox totalPages={totalPages} />
        </CardContent>
      </Card>
    </div>
  );
}
