"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { errorState } from "@/lib/utils";
import { toast } from "sonner";
import { useImperativeHandle } from "react";

export interface handleExcelImport {
  submit: () => void;
}

const excelSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (f) =>
        f.type ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      { message: "仅接受xlsx格式的excel文件" }
    ),
});

export function ExcelImport({
  ref,
  onClose,
}: {
  ref: React.Ref<handleExcelImport>;
  onClose: () => void;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof excelSchema>>({
    resolver: zodResolver(excelSchema),
  });

  const [state, setState] = useState<errorState>();

  useEffect(() => {
    if (state?.state === "error") {
      toast.error("发生错误", {description: state.message});
    }
  }, [state]);

  const onSubmit = async (data: z.infer<typeof excelSchema>) => {
    const formData = new FormData();
    formData.append("excel", data.file);
    try {
      await axios.post("/api/registry/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setState(error.response?.data);
      }
    } finally {
      onClose();
    }    
  };

  useImperativeHandle(ref, () => ({ submit: form.handleSubmit(onSubmit) }));

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excel文件</FormLabel>
              <FormControl>
                <Input
                  className="rounded-md"
                  placeholder="请选择文件"
                  type="file"
                  multiple={false}
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={(e) => {
                    field.onChange(e.target.files?.[0]);
                  }}
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
