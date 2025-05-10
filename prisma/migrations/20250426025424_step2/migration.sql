/*
  Warnings:

  - Made the column `name` on table `t_users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `t_users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "t_users" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;
