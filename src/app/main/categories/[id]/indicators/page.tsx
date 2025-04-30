import { getCategoryById } from "@/services/categories";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import IndicatorTable from "@/ui/indicators/table"


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const id = Number((await props.params).id);
  const { name, description, indicators } = await getCategoryById(id);
  return (
    <div className="flex grow gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <Card className="h-full flex-1 rounded-sm">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="border-b" />
          <IndicatorTable data={indicators} />
        </CardContent>
      </Card>
    </div>
  );
}
