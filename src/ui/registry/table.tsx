import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getNoriListByFilter } from "@/services/noriService";
import { EditNori } from "./edit-form";
import { format } from "date-fns";
import DeleteNori from "./buttons";
import { LabelPrint } from "./label-print";


export async function RegistryTable({ query, currentPage }: { query: string; currentPage: number }) {
  const noriList = await getNoriListByFilter(query, currentPage);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>检验批次</TableHead>
          <TableHead>厂家</TableHead>
          <TableHead>展会日期</TableHead>
          <TableHead>展台编号</TableHead>
          <TableHead>生产日期</TableHead>
          <TableHead>海区</TableHead>
          <TableHead>箱数</TableHead>
          <TableHead>创建日期</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {noriList.map((nori) => (
          <TableRow key={nori.id}>
            <TableCell>{nori.batchNo}</TableCell>
            <TableCell>{nori.vendor}</TableCell>
            <TableCell>
              {format(nori.exhibitionDate, "yyyy-MM-dd")}
            </TableCell>
            <TableCell>{nori.exhibitionId}</TableCell>
            <TableCell>
              {format(nori.productionDate ?? "", "yyyy-MM-dd")}
            </TableCell>
            <TableCell>{nori.maritime}</TableCell>
            <TableCell>{nori.boxQuantity}</TableCell>
            <TableCell>{format(nori.createDate, "yyyy-MM-dd")}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <EditNori noriData={nori} behavior="edit" />
                <DeleteNori id={nori.id} batchNo={nori.batchNo} />
                <LabelPrint
                  batchNo={nori.batchNo}
                  vendor={nori.vendor}
                  productionDate={nori.productionDate ?? new Date('2025-01-01')} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
