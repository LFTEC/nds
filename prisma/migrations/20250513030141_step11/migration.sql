/*
  Warnings:

  - Made the column `email` on table `t_users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "t_detection_category" ADD COLUMN     "has_pic" BOOLEAN;

-- AlterTable
ALTER TABLE "t_users" ALTER COLUMN "email" SET NOT NULL;
