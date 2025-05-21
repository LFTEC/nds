import { PrismaClient, Prisma } from "generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient();

export default prisma;
if(process.env.NODE_ENV === "development") {globalForPrisma.prisma = prisma;}


export function isPrismaClientKnownError(payload: any): payload is Prisma.PrismaClientKnownRequestError {
  if(Object.getPrototypeOf(payload)?.constructor?.name === "PrismaClientKnownRequestError") {
    return true;
  }
  return false;
}


