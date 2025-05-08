"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formSchema } from "@/data/center/centerData";
import { indicatorSchema } from "@/services/indicatorData";
import { combo, comboItem } from "generated/prisma";
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { debounce } from "lodash";
import { updateIndicateResult } from "@/services/centerService";
import { toast } from "sonner";

export function EditIndicatorValue({
  result,
  indicator,
}: {
  result: z.infer<typeof formSchema>;
  indicator: z.infer<typeof indicatorSchema> & {
    combo: (combo & { items: comboItem[] }) | null;
  };
}) {
  const data = result;  

  const form = useForm({
    defaultValues: data,
    resolver: zodResolver(formSchema),
  });

  const watchedData = form.watch();

  const debounceRef = useRef<ReturnType<typeof debounce>>(null);
  
  useEffect(()=>{
    debounceRef.current = debounce(form.handleSubmit(onSubmit), 1000);
    return () => {debounceRef.current?.cancel();}
  }, []);

  useEffect(()=>{
    if(form.formState.isDirty) {
      debounceRef.current?.();
      console.log("我触发了一次");
    }
  },[watchedData]);

  

  //const [state, setState] = useState<errorState>({ state: "success" });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("我执行了一次");
    const error = await updateIndicateResult(data);
    //setState(error);

    if(error.state === "error") {
      toast("更新检验结果时发生异常", {description: error.message});
      form.reset();
    } else {
      form.reset(data);
    }
  };  



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>

        <FormField
          control={form.control}
          name="noriId"
          render={({ field }) => (
            <FormItem>
              <FormControl hidden>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="indicatorId"
          render={({ field }) => (
            <FormItem>
              <FormControl hidden>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="noDetection"
          render={({ field }) => (
            <FormItem>
              <FormLabel>不检测</FormLabel>
              <FormControl>
                <Switch
                  className="data-[state=checked]:bg-red-600"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {indicator.type === "T" && (
          <FormField
            control={form.control}
            name="stringData"
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormLabel>检测值</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入检测值"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    className="-ml-2"
                    disabled={watchedData.noDetection}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {indicator.type === "D" && (
          <FormField
            control={form.control}
            name="numData"
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormLabel className="inline-flex flex-row justify-between mr-2">
                  <span>检测值</span>
                  <span>
                    {indicator.thresholdLow} - {indicator.thresholdHigh}
                  </span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="请输入检测值"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      className="-ml-2 pr-24"
                      disabled={watchedData.noDetection}
                    />
                    <span className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground">
                      {indicator.unit}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {indicator.type === "C" && (
          <FormField
            control={form.control}
            name="comboItemData"
            render={({ field }) => {
              return (
                <FormItem className="mt-5">
                  <FormLabel>检测值</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString()}
                    disabled={watchedData.noDetection}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full -ml-2">
                        <SelectValue placeholder="请选择检测值" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {indicator.combo?.items.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}
        {indicator.type === "B" && (
          <FormField
            control={form.control}
            name="boolData"
            render={({ field }) => (
              <FormItem className="mt-5">
                <FormLabel>检测值</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value ? "true" : "false"}
                    onValueChange={(e) => {
                      field.onChange(e==="true"?true:false);
                    }}
                    disabled={watchedData.noDetection}
                    className="flex flex-row space-x-5"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">是</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">否</FormLabel>
                    </FormItem>
                  </RadioGroup>
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
            <FormItem className="mt-5">
              <FormLabel>建议文本</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入建议文本"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  className="-ml-2 h-[240px]"
                  disabled={watchedData.noDetection}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
