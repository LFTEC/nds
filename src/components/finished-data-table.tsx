import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {format} from "date-fns";
import { getTopIndicatingList } from "@/services/statisticsService";
import { Button } from "@/components/ui/button";
import { HiOutlineDocumentText } from "react-icons/hi2";

export async function FinishedDataTable() {
  const data = await getTopIndicatingList();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>最近完成</CardTitle>
        <CardDescription>显示最近完成检验的10条检验样品清单</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>批次</TableHead>
              <TableHead>厂家</TableHead>
              <TableHead>展会日期</TableHead>
              <TableHead>展台编号</TableHead>
              <TableHead>创建日期</TableHead>
              <TableHead>检测日期</TableHead>
              <TableHead>完成日期</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(nori=>(
              <TableRow key={nori.id}>
                <TableCell>{nori.batchNo}</TableCell>
                <TableCell>{nori.vendor}</TableCell>
                <TableCell>{format(nori.exhibitionDate,"yyyy-MM-dd")}</TableCell>
                <TableCell>{nori.exhibitionId}</TableCell>
                <TableCell>{format(nori.createDate,"yyyy-MM-dd")}</TableCell>
                <TableCell>{format(nori.startDate??"","yyyy-MM-dd")}</TableCell>
                <TableCell>{format(nori.finishDate??"","yyyy-MM-dd")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      variant="ghost"
                      className="flex gap-2 items-center border py-1 px-2 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <a href={`/api/report/${nori.batchNo}/pdf`} target="_blank" rel="noopener noreferrer">
                        <HiOutlineDocumentText className="size-4" />
                        <span>报告单</span>
                      </a>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </CardContent>
    </Card>
  );
}
