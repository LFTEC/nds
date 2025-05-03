import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { noriData } from "@/data/registry/registryData";
import { EditNori } from "./edit-form";
import { HiOutlineTrash } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import DeleteNori from "./buttons";

export async function RegistryTable({ noriList }: { noriList: noriData[] }) {

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
              {nori.exhibitionDate.toISOString().split("T")[0]}
            </TableCell>
            <TableCell>{nori.exhibitionId}</TableCell>
            <TableCell>
              {nori.productionDate?.toISOString().split("T")[0]}
            </TableCell>
            <TableCell>{nori.maritime}</TableCell>
            <TableCell>{nori.boxQuantity}</TableCell>
            <TableCell>{nori.createDate.toISOString().split("T")[0]}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <EditNori noriData={nori} behavior="edit" />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex gap-2 items-center border py-1 px-2 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <HiOutlineTrash className="size-4" />
                      <span>删除</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>请确认</AlertDialogTitle>
                      <AlertDialogDescription>{`确定要删除紫菜批次${nori.batchNo}吗？`}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <DeleteNori id={nori.id} />
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
