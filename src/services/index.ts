'use server'
import prisma from "@/lib/prisma";

export const createTest = async () => {
    await prisma.t_nori_info.create({
        data: {
            vendor: "滕伟成",
            exhibition_date: new Date(),
            exhibition_id: "123",
            production_date: new Date("2024-09-23"),
            maritime: "Qingdao",
            box_quantity: 15
        }
    })
};

