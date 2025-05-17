import prisma from "@/lib/prisma";

export async function getCardCount() {
  const newCountPromise = prisma.nori.count({
    where: {
      startDate: null
    }
  });

  const indicatingCountPromise = prisma.nori.count({
    where: {
      finishDate: null,
      NOT: {startDate: null}
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

export async function getTopIndicatingList() {
  return await prisma.nori.findMany({
    where: {
      NOT: {finishDate: null}
    },
    orderBy: {
      finishDate: "desc"
    },
    take: 10
  });
}

export async function getStatisticsChartData() {
  await prisma.$queryRaw`
    with RECURSIVE all_dates as (
    select distinct date_value
    from (
      select create_date as date_value from t_nori_info tni 
      union
      select detection_date as date_value  from t_nori_info tni2 
      union 
      select complete_date as date_value  from t_nori_info tni3 
    )),
    month_series AS (
        SELECT 
            date_trunc('month', current_date) AS month_date,
            1 AS month_order
        
        UNION ALL
        
        SELECT 
            month_date - INTERVAL '1 month',
            month_order + 1
        FROM month_series
        WHERE month_order < 12
    )

    SELECT 
        to_char(month_date, 'YY/Mon') AS year_month,
        coalesce(z.create_count,0) as create_count,
        coalesce(z.detection_count,0) as detection_count,
        coalesce(z.complete_count,0) as complete_count
    FROM month_series as m
    left join (select to_char(a.date_value, 'YY/Mon' ) as year_month, 
        count(case when tni.create_date = a.date_value then 1 end) as create_count,
        count(case when tni.detection_date = a.date_value then 1 end) as detection_count,
        count(case when tni.complete_date = a.date_value then 1 end) as complete_count
    from all_dates as a
    left join t_nori_info tni on a.date_value in (tni.create_date, tni.detection_date, tni.complete_date)
    where a.date_value is not null
    group by to_char(a.date_value,'YY/Mon')) as z on to_char(m.month_date, 'YY/Mon') = z.year_month
    ORDER BY month_date;
  `
}


