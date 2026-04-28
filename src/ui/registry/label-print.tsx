"use client";

import React, { useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import JsBarcode from "jsbarcode";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { HiOutlinePrinter } from "react-icons/hi2";

interface LabelPrintProps {
  batchNo: string;
  vendor: string;
  productionDate: Date;
  onPrint?: () => void;
  autoPrint?: boolean;
}

const LabelContent = React.forwardRef<HTMLDivElement, LabelPrintProps>(
  ({ batchNo, vendor, productionDate }, ref) => {
    const barcodeRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
      if (barcodeRef.current && batchNo) {
        JsBarcode(barcodeRef.current, batchNo, {
          format: "CODE128",
          width: 1,
          height: 25,
          displayValue: false,
          fontSize: 8,
          margin: 2,
        });
      }
    }, [batchNo]);

    return (
      <div ref={ref} className="p-2 bg-white" style={{ width: "40mm", height: "50mm" }}>
        <div className="border border-gray-300 p-1 h-full flex flex-col text-xs">
          {/* 检验样品 - 条形码和批次号 */}
          <div className="text-center mb-3">
            <div className="text-xs font-bold mb-1">检验样品</div>
            <div className="flex justify-center mb-1">
              <svg ref={barcodeRef}></svg>
            </div>
            <div className="text-xs">{batchNo}</div>
          </div>

          {/* 厂家和生产日期 - 分两栏 */}
          <div className="flex-1 flex text-xs">
            <div className="flex-1 pr-1">
              <div className="font-semibold">厂家</div>
              <div className="break-words text-xs">{vendor}</div>
            </div>
            <div className="flex-1 pl-1">
              <div className="font-semibold">生产日期</div>
              <div className="text-xs">{format(productionDate, "yyyy-MM-dd")}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

LabelContent.displayName = "LabelContent";

export function LabelPrint({ batchNo, vendor, productionDate, onPrint, autoPrint }: LabelPrintProps) {
  const labelRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: labelRef,
    documentTitle: `紫菜检验标签-${batchNo}`,
    pageStyle: `
      @page {
        size: 40mm 50mm;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
    onAfterPrint: onPrint,
  });

  const hasPrinted = useRef(false);
  useEffect(() => {
    if (autoPrint && batchNo && !hasPrinted.current) {
      hasPrinted.current = true;
      handlePrint();
    }
  }, [batchNo, autoPrint]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handlePrint}
        className="flex items-center gap-2"
      >
        <HiOutlinePrinter className="size-4" />
        打印标签
      </Button>

      {/* 隐藏的打印内容 */}
      <div style={{ display: "none" }}>
        <LabelContent
          ref={labelRef}
          batchNo={batchNo}
          vendor={vendor}
          productionDate={productionDate}
        />
      </div>
    </>
  );
}