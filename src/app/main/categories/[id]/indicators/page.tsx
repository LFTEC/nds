import { getCategoryById } from "@/services/categories";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import IndicatorTable from "@/ui/indicators/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreateIndicator } from "@/ui/indicators/create-form";
import { getComboList } from "@/services/comboService";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const id = Number((await props.params).id);
  const { name, description, indicators } = await getCategoryById(id);
  const comboList = await getComboList();
  return (
    <div className="flex grow gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <Card className="h-full flex-1 rounded-sm">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="border-b" />
          <div className="flex justify-end">
            <CreateIndicator categoryId={id} comboList={comboList} />
          </div>
          <IndicatorTable data={indicators} comboList={comboList} />
        </CardContent>
      </Card>
    </div>
  );
}
