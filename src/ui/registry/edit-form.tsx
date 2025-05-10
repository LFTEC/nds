"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { HiOutlinePencil } from "react-icons/hi2";
import { HiOutlineCalendarDays } from "react-icons/hi2";

import {
  noriData,
  formSchema,
} from "@/data/registry/registryData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { cn, errorState } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateNori } from "@/services/noriService";

export function EditNori({
  noriData,
  behavior,
  className
}: React.ComponentProps<"button"> & {
  noriData?: noriData;
  behavior: "create" | "edit";
}) {
  let parsedData: z.infer<typeof formSchema>;
  if (behavior === "create") {
    parsedData = {
      vendor: "",
      exhibitionDate: new Date(),
      exhibitionId: "",
      productionDate: new Date(),
      boxQuantity: null,
      maritime: null,
    };
  } else {
    const parsedNori = formSchema.parse(noriData);
    parsedData = parsedNori;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: parsedData,
    resolver: zodResolver(formSchema),
  });

  const [state, setState] = useState<errorState>({ state: "success" });
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const result = await updateNori(noriData?.id, { state: "success" }, data);
    setState(result);
    setOpen(result.state === "error");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        setState({ state: "success" });
      }}
    >
      <DialogTrigger asChild>
        {behavior === "create" ? (
          <Button className={cn("font-semibold", className)}>
            创建待检记录
          </Button>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              "flex gap-2 items-center border py-1 px-2 rounded-md hover:bg-blue-200 transition-colors",
              className
            )}
          >
            <HiOutlinePencil className="size-4" />
            <span>编辑</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>待检紫菜批次</DialogTitle>
          <DialogDescription>
            录入待检紫菜的信息，包括紫菜的各种主数据。点击保存以提交。
          </DialogDescription>
        </DialogHeader>

        {noriData?.batchNo && <h2 className="mb-3">批次-{noriData.batchNo}</h2>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {state.state == "error" && (
              <div className="text-red-500 font-semibold text-sm">
                <p>{state.message}</p>
              </div>
            )}

            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>厂家</FormLabel>
                  <FormControl>
                    <Input placeholder="录入厂家名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exhibitionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>展会日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline">
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>选择日期</span>
                          )}
                          <HiOutlineCalendarDays className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={zhCN}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="exhibitionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>展台编号</FormLabel>
                  <FormControl>
                    <Input placeholder="输入展台编号" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>生产日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline">
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>选择日期</span>
                          )}
                          <HiOutlineCalendarDays className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                        initialFocus
                        locale={zhCN}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maritime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>海区</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="输入海区"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boxQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>箱数</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="输入箱数"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
