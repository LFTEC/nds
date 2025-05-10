"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { summarySchema } from "@/data/registry/registryData";
import { z } from "zod";
import { complete } from "@/services/noriService";
import { useState } from "react";
import { errorState } from "@/lib/utils";

export function SummaryForm({
  id,
  noriData,
  allowEdit,
}: {
  id: string;
  noriData: { level: string | null; summary: string | null };
  allowEdit: boolean;
}) {
  const form = useForm({
    defaultValues: noriData,
    resolver: zodResolver(summarySchema),
  });

  const [state, setState] = useState<errorState>({ state: "success" });
  const onSubmit = async (data: z.infer<typeof summarySchema>) => {
    const state = await complete(id, data);
    setState(state);
  };

  return (
    <Form {...form}>
      <form className="space-y-5">
        {state.state == "error" && (
          <div className="text-red-500 font-semibold text-sm">
            <p>{state.message}</p>
          </div>
        )}
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>样品等级</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? ""}
                disabled={!allowEdit}
              >
                <FormControl>
                  <SelectTrigger className="w-full -ml-2">
                    <SelectValue placeholder="请选择样品等级" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A">一等</SelectItem>
                  <SelectItem value="B">二等</SelectItem>
                  <SelectItem value="C">三等</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>检测总结</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  disabled={!allowEdit}
                  className="-ml-2 h-[240px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="block w-40 ml-auto" disabled={!allowEdit}>
              保存
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>请确认</AlertDialogTitle>
              <AlertDialogDescription>
                点击确认，本次检测将置为已完成状态，将无法对检测结果进行修改，只能在结果清单中查询
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel defaultChecked>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => form.handleSubmit(onSubmit)()}>
                确认
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
}
