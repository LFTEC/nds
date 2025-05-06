import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { formSchema } from "@/data/center/centerData";
import { getCorrespondingCategories } from "@/services/centerService";
import { EditIndicatorValue } from "@/ui/center/form";
import {z} from 'zod';
import { indicatorSchema } from "@/services/indicatorData";
import { indicator, combo, comboItem } from "@/generated/prisma";



export default async function Page(props: {
  params: Promise<{ pages: string; id: string }>;
}) {
  const categoryId = Number((await props.params).pages.split("-")[1]);
  const id = (await props.params).id;

  const category = (await getCorrespondingCategories(id)).find(
    (cate) => cate.categoryId === categoryId
  );

  return (
    <>
      <div className="space-y-2">
        <h3 className="font-semibold">{category?.categoryName}</h3>
        <div className="text-sm text-muted-foreground">
          {category?.categoryDescription}
        </div>
        <div className="shrink-0 bg-border h-[1px] w-full mb-4"></div>
      </div>

      <div className="flex flex-col space-y-4 px-2">
        {category?.detectResults.map((r) => {
          const ind = category.indicators.find((i) => i.id === r.indicatorId);
          if(!ind) throw new Error("不存在ind");
          const data: z.infer<typeof formSchema> = {
            noriId: r.noriId,
            indicatorId: r.indicatorId,
            stringData: r.stringData,
            comboItemData: r.comboItemData,
            numData: r.numData?.toString()?? null,
            boolData: r.boolData,
            noDetection: r.result === "I" ? true: false,
            suggestionText: r.suggestionText??""
          }

          const indicator: z.infer<typeof indicatorSchema> & {combo: combo & {items: comboItem[]} | null} = {
            combo: ind.combo,
            ...indicatorSchema.parse(ind)
          };

          return (
            <Card key={r.indicatorId}>
              <CardHeader>
                <CardTitle>{ind?.name}</CardTitle>
                <CardDescription>{ind?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <EditIndicatorValue result={data} indicator={indicator} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
