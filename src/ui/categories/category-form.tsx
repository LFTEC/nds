"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { category } from "generated/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { saveCategoryName } from "@/services/categories";
import { useActionState, useState } from "react";

const formSchema = z.object({
  name: z
    .string({ invalid_type_error: "请录入类别名称" })
    .min(1, "请录入类别名称"),
  description: z
    .string({ invalid_type_error: "请录入类别描述" })
    .min(1, "请录入类别描述"),
});

export function CategoryForm({
  cate,
  setOpen,
}: {
  cate: category;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: cate.name,
      description: cate.description ?? "",
    },
  });

  const saveCategoryNameWithParam = saveCategoryName.bind(null, cate.id);
  const [state, formAction] = useActionState(saveCategoryNameWithParam, {
    state: "success",
  });

  if(state.state === "error") {
    //处理错误
  }

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      await saveCategoryName(cate.id, { state: "success" }, formData);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        action={formAction}
        className="space-y-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>类别名称</FormLabel>
              <FormControl>
                <Input placeholder="请输入类别名称" {...field} />
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
              <FormLabel>类别描述</FormLabel>
              <FormControl>
                <Input placeholder="请输入类别描述" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={submitting} type="submit">{submitting ? "提交中..." : "保存"}</Button>
      </form>
    </Form>
  );
}
