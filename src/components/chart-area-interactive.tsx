import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getStatisticsChartData } from "@/services/statisticsService"
import { DataChart } from "@/ui/main/data-chart";

export const description = "An interactive area chart"

export async function ChartAreaInteractive() {
  const chartData = await getStatisticsChartData();
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>统计表</CardTitle>
        <CardDescription>
          年度检测完成量统计表
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <DataChart chartData={chartData} />
      </CardContent>
    </Card>
  )
}
