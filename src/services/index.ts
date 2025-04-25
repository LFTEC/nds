'use server'
import prisma from "@/lib/prisma";

export const createTest = async () => {
    await prisma.user.create({
        data: {
            username: "admin",
            email: "jiangyao@lefu.io",
            password: "123456",
            name: "姜耀"
        }
    })
};

