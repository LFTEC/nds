import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { allCategories } from "@/services/categories";
import { CateSortableGrid } from "@/ui/categories/sortable-grid";

export default async function Page() {
  const categories = await allCategories();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <Card className="h-full flex-1 rounded-sm">
        <CardHeader>
          <CardTitle>检验类别设置</CardTitle>
          <CardDescription>
            设置检验类别。点击编辑按钮可以修改类别；设置启用标记以启用该类别；可以进入详情中维护类别对应的检验项。按住一个类别持续0.5s可以拖动调整顺序。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="border-b" />
          <CateSortableGrid categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
