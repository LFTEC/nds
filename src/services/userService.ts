'use server'
import prisma from "@/lib/prisma";
import { Prisma } from "generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function getUserInfo(username: string) {
  return await prisma.user.findFirstOrThrow({
    where: {
      username: username,
    },
  });
}

export async function getUserInfoById(id: string) {
  return await prisma.user.findFirstOrThrow({
    where:{
      id: id
    }
  });
}

export async function createUser(data: Prisma.userCreateInput) {
  const user = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (user) {
    throw new Error("用户名已存在");
  }

  await prisma.user.create({
    data: data,
  });

  revalidatePath("/main/signup");
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
  }
) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new Error("用户不存在");
  }

  if(data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  await prisma.user.update({
    data: data,
    where: { id: id },
  });

  revalidatePath("/main/signup");
  redirect("/main/signup");
}

export async function getUserList(query: string, currentPage: number) {
  const users = prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
    },
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { username: "asc" },
    take: 20,
    skip: (currentPage - 1) * 20,
  });

  return users;
}

export async function getUserPages(query: string) {
  const count = await prisma.user.aggregate({
    _count: { _all: true },
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
  });

  return count._count._all;
}
