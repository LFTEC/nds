"use client"

import * as React from "react"
import {
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconReport,
  IconSettings,
} from "@tabler/icons-react"


import { FaFlask } from "react-icons/fa6"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "主页",
      url: "/",
      icon: IconDashboard,
    }
  ],
  navSecondary: [
    {
      title: "检验项设置",
      url: "/main/categories",
      icon: IconSettings,
    },
    {
      title: "检验员注册",
      url: "/main/signup",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    }
  ],
  documents: [
    {
      name: "待检登记",
      url: "/main/registry",
      icon: IconDatabase,
    },
    {
      name: "检测中心",
      url: "/main/center",
      icon: IconReport,
    },
    {
      name: "检单查询",
      url: "/main/reports",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({...props  }: React.ComponentProps<typeof Sidebar>) {
  
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <FaFlask className="!size-5 text-blue-500 ml-2" />
                <span className="text-base font-semibold text-blue-500  ml-4">紫菜营养评价系统</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
