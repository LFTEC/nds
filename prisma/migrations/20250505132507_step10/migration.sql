/*
  Warnings:

  - Made the column `description` on table `t_detection_category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "t_detection_category" ALTER COLUMN "description" SET NOT NULL;
