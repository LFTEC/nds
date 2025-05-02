/*
  Warnings:

  - Made the column `combo_name` on table `t_combo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isOption` on table `t_combo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `serial_no` on table `t_combo_items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "t_combo" ALTER COLUMN "combo_name" SET NOT NULL,
ALTER COLUMN "isOption" SET NOT NULL;

-- AlterTable
ALTER TABLE "t_combo_items" ALTER COLUMN "serial_no" SET NOT NULL;
