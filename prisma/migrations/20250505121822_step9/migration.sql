/*
  Warnings:

  - Made the column `noDetection` on table `t_nori_category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `detection_result` on table `t_nori_detection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "t_nori_category" ALTER COLUMN "noDetection" SET NOT NULL;

-- AlterTable
ALTER TABLE "t_nori_detection" ALTER COLUMN "detection_result" SET NOT NULL;
