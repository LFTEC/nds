"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function SummaryButton(props: { id: string }) {
  const pathname = usePathname();

  const href = `/main/center/${props.id}/forms/summary`;
  return (
    <Button
      asChild
      variant="ghost"
      className={clsx(
        "justify-start hover:underline hover:bg-transparent active:bg-gray-100  text-base",
        {
          "bg-gray-100 hover:bg-gray-100 font-semibold": pathname === href,
        }
      )}
      {...props}
    >
      <Link href={href}>检验结果</Link>
    </Button>
  );
}
