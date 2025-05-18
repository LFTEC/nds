"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ExcelImport, handleExcelImport } from "./excel-import";

export function ImportButton() {
  const refd = useRef<handleExcelImport>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold">导入数据</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>导入数据</DialogTitle>
          <DialogDescription>
            从EXCEL中导入样品信息，请注意务必按照格式导入
          </DialogDescription>
        </DialogHeader>
        <ExcelImport ref={refd} onClose={() => setIsOpen(false)} />

        <DialogFooter>
          <Button variant="outline" asChild>
            <Link href="/assets/registry_import.xlsx">下载模板</Link>
          </Button>
          <Button 
            onClick={() => {
              refd.current?.submit();
            }}
          >
            导入数据
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
