"use client";

import { indicatorSchema } from "@/services/indicatorData";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { errorState } from "@/lib/utils";
import { TransformIndicatorType } from "@/lib/utils";
import { createIndicator } from "@/services/indicatorService";

const formSchema = indicatorSchema
  .omit({ id: true, categoryId: true, hasSuggestionText: true })
  .extend({
    thresholdLow: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            return /^[0-9]*(\.[0-9]{1,2})?$/.test(value);
          }
          return true;
        },
        {
          message: "必须为数字且最多两位小数",
        }
      ),
    thresholdHigh: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            return /^[0-9]*(\.[0-9]{1,2})?$/.test(value);
          }
          return true;
        },
        {
          message: "必须为数字且最多两位小数",
        }
      ),
    
  })
  .refine(
    (data) => {
      if (data.type === "C") return !!data.comboId;
      return true;
    },
    {
      message: "当指标类型为选择型时，必须选择一个选择项",
      path: ["comboId"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "D") return !!data.unit;
      return true;
    },
    {
      message: "当指标类型为数值型时，必须录入单位",
      path: ["unit"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "D") return !!data.thresholdLow;
      return true;
    },
    {
      message: "当指标类型为数值型时，必须录入阈值下限",
      path: ["thresholdLow"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "D") return !!data.thresholdHigh;
      return true;
    },
    {
      message: "当指标类型为数值型时，必须录入阈值上限",
      path: ["thresholdHigh"],
    }
  );

export function CreateIndicator({
  categoryId,
  comboList,
}: {
  categoryId: number;
  comboList: { id: number; comboName: string; isOption: boolean }[];
}) {
  const [open, setOpen] = useState(false);

  const data: z.infer<typeof formSchema> = {
    description: "",
    name: "",
    serialNo: 0,
    noDetection: true,
    type: "T",
    unit: "",
    suggestionText: null,
    comboId: null,
    thresholdHigh: null,
    thresholdLow: null,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: data,
    resolver: zodResolver(formSchema),
  });

  const watchType = form.watch("type");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const pushData: z.infer<typeof indicatorSchema> = {
      id: 0,
      categoryId: categoryId,
      name: data.name,
      description: data.description,
      comboId: data.comboId,
      hasSuggestionText: data.suggestionText ? true : false,
      noDetection: !data.noDetection,
      serialNo: data.serialNo,
      suggestionText: data.suggestionText,
      thresholdHigh: data.thresholdHigh,
      thresholdLow: data.thresholdLow,
      type: data.type,
      unit: data.unit
    }

    const result = await createIndicator({state: "success"}, pushData);
    setState(result);

    if(result.state!=="error") {
      setOpen(false);
    }
  };

  const [state, setState] = useState<errorState>({ state: "success" });

  return (
    <Dialog
      open={open}
      onOpenChange={async (e) => {
        setOpen(e);
      }}
    >
      <DialogTrigger className="mx-2 my-2 font-semibold" asChild>
        <Button>创建新检验指标</Button>
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
                      <SelectTrigger className="w-full">
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
            {watchType === "C" && (
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
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="请选择选择项"></SelectValue>
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

            {watchType === "D" && (
              <>
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
              </>
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
