import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavButton } from "@/ui/center/nav-button";
import { getCorrespondingCategories } from "@/services/centerService";
import { getNoriDataById } from "@/services/noriService";
import { SummaryButton } from "@/ui/center/summary-button"; 
import Link from "next/link";
import React from "react";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const nori = await getNoriDataById(id);
  const correspondingCategories = await getCorrespondingCategories(id);
  correspondingCategories.sort((a, b) => {
    return a.serialNo - b.serialNo;
  });

  const pathname = `/main/center/${id}/forms/`;
  // if(!pages) {
  //   redirect(pathname + "/category-" + correspondingCategories[0].categoryId);
  // }

  return (
    <div className="flex grow gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <Card className="min-h-full flex-1 rounded-sm">
        <CardHeader>
          <CardTitle>检验单：{nori?.batchNo}</CardTitle>
          <CardDescription>
            录入检验单的详细检验结果。请注意左侧的大类分类，每个大类中的检验项录入结束后需要保存才能生效。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="shrink-0 bg-border h-[1px] w-full mb-4" />

          <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
            <aside className="-ml-4 lg:w-1/5">
              <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                {correspondingCategories.map((cate) => (
                  <NavButton
                    key={cate.categoryId}
                    href={`${pathname}category-${cate.categoryId}`}
                    name={cate.categoryName}
                  />
                ))}

                <SummaryButton id={id} />
              </nav>
            </aside>
            <div className="flex flex-col flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
