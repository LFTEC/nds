'use client'
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { createContext, useContext } from "react";
import type { User } from "next-auth";

const initUser: User = {
  username: "init",
};
const userContext = createContext<User>(initUser);

export default function MainLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) { 
  
  return (
    <userContext.Provider value={user}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </userContext.Provider>
  );
}

export function useUser()
{
  const context = useContext(userContext);
  if(context === undefined)
    throw new Error("useUser 必须在一个useProvider中使用");

  return context;
}
