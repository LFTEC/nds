"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { category } from "generated/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoEnterOutline } from "react-icons/io5";
import { HiPencilAlt } from "react-icons/hi";
import { useState } from "react";
import { setInvisible as setCategoryInvisible } from "@/services/categories";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CategoryForm } from "./category-form";

export function CategoryCard({ item }: { item: category }) {
  const [invisible, setInvisible] = useState(item.invisible);
  //const initialState : errorState = {state: 'success'};

  //const [state, categoryStatusAction] = useActionState(setCategoryInvisible, initialState);
  const handleInvisibleChange = async (e: boolean) => {
    const newInvisible = !e;
    setInvisible(newInvisible);
    const state = await setCategoryInvisible({
      id: item.id,
      invisible: newInvisible,
    });

    if (state.state == "error") {
      toast("发生异常", { description: `${state.message}` });
    }
  };

  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-ellipsis line-clamp-1">{item.name}</span>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent border-none outline-0 cursor-pointer shrink-0"
              >
                <HiPencilAlt className="icon-b size-5 text-primary cursor-pointer ml-2" />
              </Button>
            </DialogTrigger>
          </CardTitle>
          <CardDescription className="h-10 overflow-hidden text-ellipsis line-clamp-2">
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="enable-div"
                checked={!invisible}
                onCheckedChange={handleInvisibleChange}
              />
              <Label htmlFor="enable-div">启用</Label>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={700}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    className="bg-primary hover:shadow-xl hover:shadow-blue-200 transition-all"
                  >
                    <Link href={`/main/categories/${item.id}/indicators`}>
                      <IoEnterOutline className="size-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>编辑检测指标</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改检测类别</DialogTitle>
          <DialogDescription>
            修改检测类别的名称、描述。单击“保存”提交修改。
          </DialogDescription>
        </DialogHeader>
        <CategoryForm cate={item} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
