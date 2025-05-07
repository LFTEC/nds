import { getIndicatingNoriById } from "@/services/noriService";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { SummaryForm } from "@/ui/center/summary-form";


export default async function Page(props:{params: Promise<{id: string}>}) {
  const id = (await props.params).id;
  const nori = await getIndicatingNoriById(id);

  const allowEdit = nori.detections.find(ind=>ind.result === "N") ? false : true;

  return (
    <>
      <div className="space-y-2">
        <h3 className="font-semibold">检验结果总结</h3>
        <div className="text-sm text-muted-foreground">
          根据所有的检验项，判断样品的等级，并录入最终结果分析。
        </div>
        <div className="shrink-0 bg-border h-[1px] w-full mb-4"></div>
      </div>

      <div className="flex flex-col space-y-4 px-2">


        <Card>
          <CardHeader>
            <CardTitle>紫菜等级</CardTitle>
            <CardDescription>检验最终判断的样品等级</CardDescription>
          </CardHeader>
          <CardContent>
            <SummaryForm id={nori.id} noriData={{level: nori.level, summary: nori.summary}} allowEdit={allowEdit} />
          </CardContent>
        </Card>

      </div>
    </>
  );
}