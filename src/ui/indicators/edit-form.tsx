"use client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { getIndicatorById, updateIndicator } from "@/services/indicatorService";
import { HiOutlinePencil } from "react-icons/hi2";
import { indicatorSchema } from "@/services/indicatorData";
import { useEffect, useState } from "react";
import { indicator } from "@/generated/prisma";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { errorState, TransformIndicatorType } from "@/lib/utils";

const formSchema = indicatorSchema
  .omit({ id: true, categoryId: true, hasSuggestionText: true })
  .extend({
    thresholdHigh: z
      .string()
      .refine((val) => /^[0-9]*(\.[0-9]{1,2})?$/.test(val), {
        message: "必须为数字且最多两位小数",
      })
      .nullable(),
    thresholdLow: z
      .string()
      .refine((val) => /^[0-9]*(\.[0-9]{1,2})?$/.test(val), {
        message: "必须为数字且最多两位小数",
      })
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.type === "D") {
        if (data.unit) return true;
        else return false;
      }
      return true;
    },
    {
      message: "当指标类型为数值型时，必须录入单位",
      path: ["unit"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "D") {
        if (data.thresholdHigh) return true;
        else return false;
      }
      return true;
    },
    {
      message: "当指标类型为数值型时，必须录入阈值上限",
      path: ["thresholdHigh"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "D") {
        if (data.thresholdLow) return true;
        else return false;
      }
      return true;
    },
    {
      message: "当指标类型为数值型时，必须录入阈值下限",
      path: ["thresholdLow"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "C") {
        if (data.comboId) return true;
        return false;
      }
      return true;
    },
    {
      message: "当指标类型为选择型时，必须选择一个选择项",
      path: ["comboId"],
    }
  );

export function EditIndicator({
  id,
  comboList,
}: {
  id: number;
  comboList: { id: number; comboName: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [data, setIndicator] = useState<z.infer<typeof formSchema> | null>(
    null
  );
  const [state, setState] = useState<errorState>({ state: "success" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    //此处可以通过defaultValues的异步调用实现数据刷新
    defaultValues: {
      name: "",
      description: "",
      serialNo: 0,
      type: "B",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const indicatorData: z.infer<typeof indicatorSchema> = {
      id: id,
      name: data.name,
      description: data.description,
      serialNo: data.serialNo,
      type: data.type,
      suggestionText: data.suggestionText,
      comboId: data.comboId,
      categoryId: 0,
      hasSuggestionText: data.suggestionText ? true : false,
      unit: data.unit,
      thresholdLow: data.thresholdLow,
      thresholdHigh: data.thresholdHigh,
      noDetection: !data.noDetection,
    };

    const state = await updateIndicator(
      id,
      { state: "success" },
      indicatorData
    );

    setState(state);
    if (state.state !== "error") {
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={async (e) => {
        setOpen(e);
        if (e) {
          const result = await getIndicatorById(id);
          result.noDetection = !result.noDetection;
          setIndicator(result);
          let parsed = formSchema.safeParse(result);
          if (parsed.success) form.reset(parsed.data);
        }
      }}
    >
      <DialogTrigger className="flex gap-2 items-center border py-1 px-2 rounded-md hover:bg-blue-200 transition-colors">
        <HiOutlinePencil className="size-4" />
        <span>编辑</span>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>检测指标设置</DialogTitle>
          <DialogDescription>
            修改检测指标的具体信息，设置不同的检测指标类型，并指定对应的参数。单击“保存”提交。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {state.state == "error" && (
              <div className="text-red-500 font-semibold text-sm">
                <p>{state.message}</p>
              </div>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>指标名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入指标名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>指标描述</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入指标描述" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serialNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>顺序号</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入顺序号" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="noDetection"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>是否检测</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>指标类型</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full" disabled>
                        <SelectValue placeholder="请选择指标的类型"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="C">
                        {TransformIndicatorType("C")}
                      </SelectItem>
                      <SelectItem value="D">
                        {TransformIndicatorType("D")}
                      </SelectItem>
                      <SelectItem value="T">
                        {TransformIndicatorType("T")}
                      </SelectItem>
                      <SelectItem value="B">
                        {TransformIndicatorType("B")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {data?.type === "C" && (
              <FormField
                control={form.control}
                name="comboId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>选择项</FormLabel>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full" disabled>
                          <SelectValue></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {comboList.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.comboName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {data?.type === "D" && (
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>单位</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入单位" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {data?.type === "D" && (
              <FormField
                control={form.control}
                name="thresholdLow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>指标下限（参考项）</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入指标下限"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {data?.type === "D" && (
              <FormField
                control={form.control}
                name="thresholdHigh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>指标上限（参考项）</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="请输入指标上限"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="suggestionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>检测文本</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入指标检测结果文本"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      rows={20}
                      className="resize-y"
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
