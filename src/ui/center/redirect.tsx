'use client'
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"

export function RedirectPage({path}:{path: string}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(()=>{
    router.replace(pathname + "/" + path);
  }, []);

  return (<div>跳转中...</div>);
}