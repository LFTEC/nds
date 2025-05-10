/*
  Warnings:

  - Made the column `create_date` on table `t_nori_info` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "t_nori_info" ADD COLUMN     "summary" TEXT,
ALTER COLUMN "create_date" SET NOT NULL;
