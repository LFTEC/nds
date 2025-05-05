'use client'

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Page({firstPage}: {firstPage: number}){
  const pathname = usePathname();
  const router = useRouter();

  useEffect(()=>{
    router.replace(pathname + "/category-" + firstPage);
  }, []);

  return (<p>正在跳转...</p>);
}