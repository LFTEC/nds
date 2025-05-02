/*
  Warnings:

  - Made the column `unit` on table `t_detection_indicators` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "t_detection_indicators" ALTER COLUMN "unit" SET NOT NULL;
