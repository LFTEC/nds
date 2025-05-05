import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const paths = pathname.split('/').slice(1); 

  const menu = [
    {
      name: "main",
      text: "主页",
      url: "/main"
    },
    {
      name: "registry",
      text: "待检登记",
      url: "/main/registry"
    },
    {
      name: "center",
      text: "检测中心",
      url: "/main/center"
    },
    {
      name: "reports",
      text: "检单查询",
      url: "/main/report"
    },
    {
      name: "categories",
      text: "检验项设置",
      url: "/main/categories"
    },
    {
      name: "signup",
      text: "检验员注册",
      url: "/main/signup"
    },

  ];

  const menuList = paths.map((path)=>{
    const item = menu.find((m)=>m.name === path);
    if(item) {
      return item;
    } else {
      return {name: path, text: path, url: undefined}
    }
  });


  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {menuList.map((path, index)=>(  
              <React.Fragment key={path?.name}>  
                {index >= 1 && <BreadcrumbSeparator ></BreadcrumbSeparator>}     
                <BreadcrumbItem >
                  {index < menuList.length - 1 && path.url ? <BreadcrumbLink href={path?.url}>{path?.text}</BreadcrumbLink>: <BreadcrumbPage>{path?.text}</BreadcrumbPage>}
                </BreadcrumbItem>
              </React.Fragment> 
            ))}
            
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
