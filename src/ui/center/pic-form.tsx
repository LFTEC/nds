'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pictureSchema } from "@/data/center/centerData";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormDescription, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";



export function PictureForm({noriId, categoryId}: {noriId: string, categoryId: number}) {
  const form = useForm<z.infer<typeof pictureSchema>>({
    resolver: zodResolver(pictureSchema)
  });

  return (
    <Form {...form}>
      <form>
        <FormField control={form.control} name="picture" render={({field})=>(
          <FormItem>
            <FormLabel>图片</FormLabel>
            <FormControl>
              <Input type="file" placeholder="请选择一个图片"  />
            </FormControl>
            <FormDescription>请选择一个图片，大小不能超过10M</FormDescription>
            <FormMessage />
          </FormItem>
        )}
        />
      </form>
    </Form>
  );
}