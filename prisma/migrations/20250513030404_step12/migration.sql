/*
  Warnings:

  - Made the column `has_pic` on table `t_detection_category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "t_detection_category" ALTER COLUMN "has_pic" SET NOT NULL,
ALTER COLUMN "has_pic" SET DEFAULT false;
