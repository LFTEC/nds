"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export function NavButton({
  className,
  href,
  name,
  ...props
}: React.ComponentProps<"button"> & { href: string; name: string }) {
  const pathname = usePathname();
  return (
    <Button
      key={props.key}
      asChild
      variant="ghost"
      className={clsx("justify-start hover:underline hover:bg-transparent active:bg-gray-100  text-base", {
        "bg-gray-100 hover:bg-gray-100 font-semibold": pathname === href
      })}
      {...props}
    >
      <Link href={href}>{name}</Link>
    </Button>
  );
}
