import prisma from "@/lib/prisma";

export async function getCardCount() {
  const newCountPromise = prisma.nori.count({
    where: {
      startDate: null
    }
  });

  const indicatingCountPromise = prisma.nori.count({
    where: {
      finishDate: null
    }
  });

  const finishedCountPromise = prisma.nori.count({
    where: {
      NOT: { finishDate: null}
    }
  });

  const indicatorCountPromise = prisma.detectResult.count({
    where: {
      result: "N"
    }
  });

  const result = await Promise.all([newCountPromise, indicatingCountPromise, finishedCountPromise, indicatorCountPromise]);
  return {
    newCount: result[0],
    indicatingCount: result[1],
    finishedCount: result[2],
    indicatorCount: result[3]
  };
}


