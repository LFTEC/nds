/*
  Warnings:

  - Made the column `category_name` on table `t_detection_category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `serial_no` on table `t_detection_category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `invisible` on table `t_detection_category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "t_detection_category" ALTER COLUMN "category_name" SET NOT NULL,
ALTER COLUMN "serial_no" SET NOT NULL,
ALTER COLUMN "invisible" SET NOT NULL;
