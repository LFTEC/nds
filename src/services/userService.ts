import prisma from "@/lib/prisma";
import { Prisma } from "generated/prisma/client";

export async function getUserInfo(username: string) {
  return await prisma.user.findFirstOrThrow({
    where: {
      username: username,
    },
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
}

export async function updateUser(
  username: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
  }
) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new Error("用户名不存在");
  }

  await prisma.user.update({
    data: data,
    where: { username: username },
  });
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
