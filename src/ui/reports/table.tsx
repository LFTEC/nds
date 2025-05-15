import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getReports } from "@/services/noriService";
import { format } from "date-fns";

export async function ReportsTable({ query, currentPage }: { query: string; currentPage: number }) {
  const noriList = await getReports(query,currentPage);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>检验批次</TableHead>
          <TableHead>厂家</TableHead>
          <TableHead>展会日期</TableHead>
          <TableHead>展台编号</TableHead>
          <TableHead>总检验项目</TableHead>
          <TableHead>完成检验项</TableHead>
          <TableHead>创建日期</TableHead>
          <TableHead>检验开始日期</TableHead>
          <TableHead>检验完成日期</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {noriList.map((nori) => (
          <TableRow key={nori.id}>
            <TableCell>{nori.batchNo}</TableCell>
            <TableCell>{nori.vendor}</TableCell>
            <TableCell>
              {format(nori.exhibitionDate,"yyyy-MM-dd")}
            </TableCell>
            <TableCell>{nori.exhibitionId}</TableCell>
            <TableCell>
              {nori.allIndicators}
            </TableCell>
            <TableCell>{nori.finishedIndicators}</TableCell>
            <TableCell>{format(nori.createDate,"yyyy-MM-dd")}</TableCell>
            <TableCell>{format(nori.startDate??"", "yyyy-MM-dd")}</TableCell>
            <TableCell>{format(nori.finishDate??"", "yyyy-MM-dd")}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
