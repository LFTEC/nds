import prisma from "@/lib/prisma";

export function getComboList() {
  return prisma.combo.findMany();
}
