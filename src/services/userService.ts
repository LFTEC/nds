import prisma from "@/lib/prisma";

export async function getUserInfo(username: string) {
    return await prisma.user.findFirstOrThrow({
        where: {
            username: username
        }
    })
}