/*
  Warnings:

  - Added the required column `exhibition_date::text` to the `t_nori_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "t_nori_info" ADD COLUMN     "exhibition_date::text" TEXT NOT NULL;
