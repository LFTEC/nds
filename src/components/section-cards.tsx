import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCardCount } from "@/services/statisticsService";
import Link from "next/link";

export async function SectionCards() {
  const data = await getCardCount();

  return (
    <div
      className="**:data-[slot=card]:from-primary/5 **:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 **:data-[slot=card]:bg-gradient-to-t **:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4
      **:data-[slot=card-description]:text-primary"
    >
      <Link href="/main/registry">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>新增样品</CardDescription>
            <CardTitle className="text-center min-w-0 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl truncate">
              {data.newCount.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
        </Card>
      </Link>

      <Link href="/main/center">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>检验中样品</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mx-auto">
              {data.indicatingCount.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
        </Card>
      </Link>

      <Link href="/main/reports">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>检验完成</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mx-auto">
              {data.finishedCount.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
        </Card>
      </Link>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>剩余检验项</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mx-auto">
            {data.indicatorCount.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div> */}
        </CardFooter>
      </Card>
    </div>
  );
}
