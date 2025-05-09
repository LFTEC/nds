import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import  {RegistryTable} from "@/ui/registry/table";
import { getTotalPages, getNoriListByFilter } from "@/services/noriService";
import { noriData } from "@/data/registry/registryData";
import { EditNori } from "@/ui/registry/edit-form";
import { SearchInput } from "@/ui/search-box";

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: number }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const page = searchParams?.page|| 1;

  return (
    <div className="flex grow gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <Card className="h-full flex-1 rounded-sm">
        <CardHeader>
          <CardTitle>待检登记</CardTitle>
          <CardDescription>录入需进行检测的紫菜产品信息，录入后进入待检状态。待检测开始后将不再在此处显示。</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="border-b"/>
          <div className="flex gap-4 mx-2 my-2">
            <SearchInput placeholder="查询待检样品清单" />
            <EditNori behavior="create" />
          </div>
          <RegistryTable query={query} currentPage={page} />
        </CardContent>
      </Card>
    </div>
  );
}
