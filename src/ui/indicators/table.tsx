import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { indicator } from "generated/prisma";
import { EditIndicator } from "./edit-form";
import clsx from "clsx";
import { HiOutlineXMark, HiOutlineCheck } from "react-icons/hi2";
import { TransformIndicatorType } from "@/lib/utils";

export default function IndicatorTable({
  data,
  comboList,
}: {
  data: indicator[];
  comboList: { id: number; comboName: string }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>指标名称</TableHead>
          <TableHead>指标描述</TableHead>
          <TableHead>单位</TableHead>
          <TableHead>显示顺序</TableHead>
          <TableHead>是否检测</TableHead>
          <TableHead>指标类型</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((ind) => (
          <TableRow key={ind.id}>
            <TableCell>{ind.name}</TableCell>
            <TableCell>{ind.description}</TableCell>
            <TableCell>{ind.unit}</TableCell>
            <TableCell>{ind.serialNo}</TableCell>
            <TableCell>
              <span
                className={clsx(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs",
                  {
                    "bg-gray-100 text-gray-500": ind.noDetection === true,
                    "bg-green-500 text-white": ind.noDetection === false,
                  }
                )}
              >
                {ind.noDetection && (
                  <>
                    <HiOutlineXMark className="mr-1 w-4 text-gray-500" />
                    不检测
                  </>
                )}

                {!ind.noDetection && (
                  <>
                    <HiOutlineCheck className="mr-1 w-4 text-white" />
                    检测
                  </>
                )}
              </span>
            </TableCell>
            <TableCell>{TransformIndicatorType(ind.type)}</TableCell>
            <TableCell className="w-[100px]">
              <EditIndicator id={ind.id} comboList={comboList} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
