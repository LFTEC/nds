'use client'
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { debounce } from "lodash";
import { Label } from "@/components/ui/label";

export function SearchInput(props: React.ComponentProps<"input">) {
  return(
    <div className="flex flex-1 shrink-0 relative">
      <Label htmlFor="search">
        查询
      </Label>
      <input className="block peer w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        {...props} />
      
      <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

