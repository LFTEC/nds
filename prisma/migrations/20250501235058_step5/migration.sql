/*
  Warnings:

  - Made the column `serial_no` on table `t_detection_indicators` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "t_detection_indicators" ADD COLUMN     "indicator_des" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "serial_no" SET NOT NULL,
ALTER COLUMN "unit" DROP NOT NULL;
