"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { debounce } from "lodash";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SearchInput(props: React.ComponentProps<"input">) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const debounceSubmit = useRef<ReturnType<typeof debounce>>(null);
  useEffect(() => {
    debounceSubmit.current = debounce((term: string)=>{
      console.log("我被调用一次");
      const params = new URLSearchParams(searchParams);
      params.set('page', "1");
      if(term){
        params.set('query', term);
      } else {
        params.delete('query');
      }

      replace(`${pathname}?${params.toString()}`);

    },300);
    return debounceSubmit.current.cancel();
  },[]);



  return (
    <div className="flex flex-1 shrink-0 relative">
      <Label htmlFor="search" className="sr-only">查询条件</Label>
      <input
        className={cn("block peer w-full rounded-md border border-gray-200 pl-10 py-2 text-sm outline-2 placeholder:text-gray-500", props.className)}
        onChange={(e)=>{debounceSubmit.current?.(e.target.value)}}        
        defaultValue={searchParams.get('query')?.toString()}
        {...props}
      />

      <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
