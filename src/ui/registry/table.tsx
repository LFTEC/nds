import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { noriData } from "@/data/registry/registryData";
import { EditNori } from "./edit-form";

export async function RegistryTable({noriList}:{noriList: noriData[]}) {
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
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {noriList.map((nori) => (
          <TableRow key={nori.id}>
            <TableCell>{nori.batchNo}</TableCell>
            <TableCell>{nori.vendor}</TableCell>
            <TableCell>
              {nori.exhibitionDate.toISOString().split("T")[0]}
            </TableCell>
            <TableCell>{nori.exhibitionId}</TableCell>
            <TableCell>
              {nori.productionDate?.toISOString().split("T")[0]}
            </TableCell>
            <TableCell>{nori.maritime}</TableCell>
            <TableCell>{nori.boxQuantity}</TableCell>
            <TableCell>{nori.createDate.toISOString().split("T")[0]}</TableCell>
            <TableCell><EditNori noriData={nori} behavior="edit" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
