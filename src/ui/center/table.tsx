import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { indicatingData } from "@/data/center/centerData";
import { HiOutlineArrowRightStartOnRectangle } from "react-icons/hi2";

export async function IndicatingTable({
  indicatingList,
}: {
  indicatingList: indicatingData[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>检验批次</TableHead>
          <TableHead>厂家</TableHead>
          <TableHead>展会日期</TableHead>
          <TableHead>展台编号</TableHead>
          <TableHead>未检验项目</TableHead>
          <TableHead>已检验项目</TableHead>
          <TableHead>检验开始日期</TableHead>
          <TableHead>检验结束日期</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {indicatingList.map((nori) => (
          <TableRow key={nori.id}>
            <TableCell>{nori.batchNo}</TableCell>
            <TableCell>{nori.vender}</TableCell>
            <TableCell>
              {nori.exhibitionDate.toISOString().split("T")[0]}
            </TableCell>
            <TableCell>{nori.exhibitionId}</TableCell>
            <TableCell>{nori.indicatingItems}</TableCell>
            <TableCell>{nori.finishedItems}</TableCell>
            <TableCell>{nori.startDate?.toISOString().split("T")[0]}</TableCell>
            <TableCell>
              {nori.finishDate?.toISOString().split("T")[0]}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="flex gap-2 items-center border py-1 px-2 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <HiOutlineArrowRightStartOnRectangle className="size-4" />
                  <span>录入</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
