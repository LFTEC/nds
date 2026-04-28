"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

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

import {
  Dialog,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useUser } from "@/ui/main/main-layout";
import { logout } from "@/lib/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { updateUserProfile, changePassword, getUserInfo } from "@/services/userService";
import { toast } from "sonner";

const userInfoSchema = z.object({
  username: z.string(),
  name: z.string().min(1, { message: "请录入姓名" }),
  email: z.string().email("请录入正确的邮箱"),
});

const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "请录入原密码" }),
    password: z
      .string()
      .min(8, "密码至少需要8个字符"),
    repeat: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.password.length >= 8) {
      const conditions = [
        /[a-z]/.test(values.password),
        /[A-Z]/.test(values.password),
        /\d/.test(values.password),
        /[@.!]/.test(values.password),
      ];
      if (conditions.filter(Boolean).length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "密码必须包含数字、小写字母、大写字母与特殊字符中的三种",
          path: ["password"],
        });
      }
    }
    if (values.repeat && values.password !== values.repeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "两次输入的密码不一致",
        path: ["repeat"],
      });
    }
  });

function UserInfoDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ReturnType<typeof useUser>;
}) {
  const [dbUser, setDbUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const form = useForm<z.infer<typeof userInfoSchema>>({
    defaultValues: {
      username: user.username || "",
      name: user.name || "",
      email: user.email || "",
    },
    resolver: zodResolver(userInfoSchema),
  });

  useEffect(() => {
    if (open && user.username) {
      getUserInfo(user.username).then((u) => {
        setDbUser({ id: u.id, name: u.name, email: u.email });
        form.reset({
          username: u.username,
          name: u.name,
          email: u.email,
        });
      });
    }
  }, [open, user.username]);

  const onSubmit = async (data: z.infer<typeof userInfoSchema>) => {
    if (!dbUser) return;
    try {
      await updateUserProfile(dbUser.id, {
        name: data.name,
        email: data.email,
      });
      toast.success("账户信息已更新");
      onOpenChange(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "更新失败");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>账户信息</DialogTitle>
          <DialogDescription>编辑账户信息</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>账号</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
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
          <Button className="px-16 mt-5" onClick={form.handleSubmit(onSubmit)}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PasswordChangeDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ReturnType<typeof useUser>;
}) {
  const [dbUserId, setDbUserId] = useState<string | null>(null);
  const form = useForm<z.infer<typeof passwordChangeSchema>>({
    defaultValues: {
      oldPassword: "",
      password: "",
      repeat: "",
    },
    resolver: zodResolver(passwordChangeSchema),
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      return;
    }
    if (user.username) {
      getUserInfo(user.username).then((u) => {
        setDbUserId(u.id);
      });
    }
  }, [open, user.username]);

  const onSubmit = async (data: z.infer<typeof passwordChangeSchema>) => {
    if (!dbUserId) return;
    try {
      await changePassword(dbUserId, {
        oldPassword: data.oldPassword,
        newPassword: data.password,
      });
      toast.success("密码修改成功");
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "密码修改失败");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改密码</DialogTitle>
          <DialogDescription>
            账号：{user.username} &nbsp;&nbsp; 姓名：{user.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-5">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>原密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="请输入原密码"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="请输入新密码"
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
                  <FormLabel>重复新密码</FormLabel>
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
          <Button className="px-16 mt-5" onClick={form.handleSubmit(onSubmit)}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const user = useUser();
  const [infoOpen, setInfoOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-10 shrink-0 " />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user.image ?? "/"}
                      alt={user.name ?? ""}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setInfoOpen(true)}>
                  <IconUserCircle />
                  账号信息
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setPwdOpen(true)}>
                  <IconCreditCard />
                  修改密码
                </DropdownMenuItem>

                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>
                    <IconLogout />
                    Log out
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>请确定</AlertDialogTitle>
              <AlertDialogDescription>
                点击确定你将会退出系统，是否确定？如果不想退出，请点击取消。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <form action={logout}>
                <AlertDialogAction type="submit">确定</AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarMenuItem>

      <UserInfoDialog
        open={infoOpen}
        onOpenChange={setInfoOpen}
        user={user}
      />
      <PasswordChangeDialog
        open={pwdOpen}
        onOpenChange={setPwdOpen}
        user={user}
      />
    </SidebarMenu>
  );
}
