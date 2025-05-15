"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { pictureSchema } from "@/data/center/centerData";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { fetchPicture } from "@/services/centerService";
import { Button } from "@/components/ui/button";
import { HiOutlineXMark } from "react-icons/hi2";

export function PictureForm({
  noriId,
  categoryId,
}: {
  noriId: string;
  categoryId: number;
}) {
  const form = useForm<z.infer<typeof pictureSchema>>({
    resolver: zodResolver(pictureSchema),
  });

  const picture = form.watch("picture");

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(()=>{
    const fetchData = async ()=>{
      const picture = await fetchPicture(noriId, categoryId);
      if(picture) {
        setImageUrl(URL.createObjectURL(picture));
      }
    }

    fetchData();
  },[]);

  useEffect(() => {
    if (picture) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(picture);

      form.handleSubmit(onSubmit)();
    }
  }, [picture]);

  const onSubmit = async (data: z.infer<typeof pictureSchema>) => {
    const formData = new FormData();
    formData.set("nori_id", noriId);
    formData.set("category_id", categoryId.toString());
    formData.set("file", data.picture);
    try {
      setLoading(true);
      await axios.post("/api/center/upload", formData, {
      headers: {
        "X-File-Name": encodeURIComponent(data.picture.name),
        "X-File-Type": data.picture.type,
      }
    });
    } catch {

    }
    finally{
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="picture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>图片</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple={false}
                    accept="image/*"
                    placeholder="请选择一个图片"
                    onChange={(e) => {
                      field.onChange(e.target.files?.[0]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  请选择一个图片，大小不能超过10M
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {imageUrl && (
        <div className="relative mt-10">
          <Image src={imageUrl} alt="preview" width={500} height={500} onClick={()=>setIsOpen(true)} className="object-cover cursor-pointer" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md" >
              <AiOutlineLoading3Quarters className="text-white text-4xl animate-spin" />
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-screen h-screen">
            <Image src={imageUrl!} alt="preview" fill className="object-contain max-h-screen p-20"/>
            <Button onClick={()=>setIsOpen(false)} className="absolute top-8 right-8 w-8 h-8 text-white border-white border-2 rounded-full" variant="ghost" >
              <HiOutlineXMark className="size-6" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
