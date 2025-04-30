import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {indicator} from '@/generated/prisma';

export default function IndicatorTable({data}: {data: indicator[]}){
  const indTypeName = (indType: string) => {
    switch(indType) {
      case "T": 
        return "文本型";
      case "C":
        return "选择型";
      case "I": 
        return "整数型";
      case "D":
        return "数值型";
      case "B":
        return "是否型";
      case "P":
        return "图像型";
    }
  } 

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>指标名称</TableHead>
          <TableHead>单位</TableHead>
          <TableHead>显示顺序</TableHead>
          <TableHead>是否检测</TableHead>
          <TableHead>指标类型</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((ind)=>(
          <TableRow key={ind.id}>
            <TableCell>{ind.name}</TableCell>
            <TableCell>{ind.unit}</TableCell>
            <TableCell>{ind.serialNo}</TableCell>
            <TableCell>{ind.noDetection ? "不检测" : "检测"}</TableCell>
            <TableCell>{indTypeName(ind.type)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}