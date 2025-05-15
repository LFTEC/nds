"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavButton({
  href,
  name,
  className,
  ...props
}: React.ComponentProps<"button"> & { href: string; name: string }) {
  const pathname = usePathname();
  return (
    <Button
      key={props.key}
      asChild
      variant="ghost"
      className={cn("justify-start hover:underline hover:bg-transparent active:bg-gray-100 text-base", {
        "bg-gray-100 hover:bg-gray-100 font-semibold": pathname === href
      }, className)}
      {...props}
    >
      <Link href={href}>{name}</Link>
    </Button>
  );
}
