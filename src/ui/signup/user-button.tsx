"use client";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { HiOutlinePencil } from "react-icons/hi";
import { HiOutlineKey } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { updateUser, hash, getUserInfoById } from "@/services/userService";
import { useEffect } from "react";

const userInfoSchema = z.object({
  username: z.string().min(8, { message: "请录入用户名，用户名长度为8-16位" }).max(16, {message: "请录入用户名，用户名长度为8-16位"}),
  name: z.string().min(1, { message: "请录入姓名" }),
  email: z.string().email("请录入正确的邮箱"),
});

export function UserButton({
  behavior,
  id,
  ...props
}: React.ComponentProps<typeof Button> & {
  behavior: "create" | "edit";
  id?: string;
}) {
  const form = useForm<z.infer<typeof userInfoSchema>>({
    defaultValues: {
      username: "",
      email: "",
      name: "",
    },
    resolver: zodResolver(userInfoSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (behavior === "edit" && id) {
        const user = await getUserInfoById(id);
        form.reset({
          name: user.name,
          username: user.username,
          email: user.email,
        });
      }
    };
    fetchData();
  }, [form.reset]);

  const onSubmit = async (data: z.infer<typeof userInfoSchema>) => {

  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {behavior === "create" ? (
          <Button className="font-semibold">创建用户</Button>
        ) : (
          <Button
            variant="ghost"
            className="flex gap-2 items-center border py-1 px-2 rounded-md hover:bg-blue-200 transition-colors"
          >
            <HiOutlinePencil className="size-4" />
            修改
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑检验员信息</DialogTitle>
          <DialogDescription>编辑检验员信息</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入用户名" disabled={behavior==="edit"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入姓名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入邮箱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button className="px-16 mt-5" onClick={form.handleSubmit(onSubmit)}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "密码至少需要8个字符")
      .refine(
        (value) => {
          const conditions = [
            /[a-z]/.test(value),
            /[A-Z]/.test(value),
            /\d/.test(value),
            /[@.!]/.test(value),
          ];

          const metConditions = conditions.filter(Boolean).length;
          return metConditions >= 3;
        },
        {
          message: "密码必须包含数字、小写字母、大写字母与特殊字符中的三种",
        }
      ),
    repeat: z.string(),
  })
  .refine((str) => str.password === str.repeat, {
    message: "两次输入的密码不一致",
    path: ["repeat"],
  });

export function PasswordButton({
  id,
  ...props
}: React.ComponentProps<typeof Button> & { id: string }) {
  const form = useForm<z.infer<typeof passwordSchema>>({
    defaultValues: {
      password: "",
      repeat: "",
    },
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    const hashedPassword = await hash(data.password);

    await updateUser(id, {
      password: hashedPassword,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex gap-2 items-center border py-1 px-2 rounded-md hover:bg-blue-200 transition-colors",
            props.className
          )}
        >
          <HiOutlineKey className="size-4" />
          修改密码
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改密码</DialogTitle>
          <DialogDescription>修改用户的密码</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="请输入密码"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>重复</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="请再输入一次"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button className="mt-5 px-16" onClick={form.handleSubmit(onSubmit)}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
