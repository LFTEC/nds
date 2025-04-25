/*
  Warnings:

  - You are about to drop the column `is_option` on the `t_combo` table. All the data in the column will be lost.
  - The primary key for the `t_nori_category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `no_detection` on the `t_nori_category` table. All the data in the column will be lost.
  - The primary key for the `t_nori_detection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `user_id` column on the `t_nori_detection` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `combo_id` on table `t_combo_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `item_name` on table `t_combo_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_abnormal` on table `t_combo_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `indicator_name` on table `t_detection_indicators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `no_detection` on table `t_detection_indicators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category_id` on table `t_detection_indicators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `t_detection_indicators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `has_suggestion_text` on table `t_detection_indicators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `unit` on table `t_detection_indicators` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `category_id` on the `t_nori_category` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `nori_id` on the `t_nori_detection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `vendor` on table `t_nori_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exhibition_date` on table `t_nori_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exhibition_id` on table `t_nori_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `t_nori_info` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "t_combo" DROP COLUMN "is_option",
ADD COLUMN     "isOption" BOOLEAN;

-- AlterTable
ALTER TABLE "t_combo_items" ALTER COLUMN "combo_id" SET NOT NULL,
ALTER COLUMN "item_name" SET NOT NULL,
ALTER COLUMN "is_abnormal" SET NOT NULL;

-- AlterTable
ALTER TABLE "t_detection_indicators" ALTER COLUMN "indicator_name" SET NOT NULL,
ALTER COLUMN "no_detection" SET NOT NULL,
ALTER COLUMN "category_id" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "has_suggestion_text" SET NOT NULL,
ALTER COLUMN "unit" SET NOT NULL;

-- AlterTable
ALTER TABLE "t_nori_category" DROP CONSTRAINT "t_nori_category_pk",
DROP COLUMN "no_detection",
ADD COLUMN     "noDetection" BOOLEAN,
DROP COLUMN "category_id",
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD CONSTRAINT "t_nori_category_pk" PRIMARY KEY ("nori_id", "category_id");

-- AlterTable
ALTER TABLE "t_nori_detection" DROP CONSTRAINT "t_nori_detection_pk",
DROP COLUMN "nori_id",
ADD COLUMN     "nori_id" UUID NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID,
ADD CONSTRAINT "t_nori_detection_pk" PRIMARY KEY ("nori_id", "indicator_id");

-- AlterTable
ALTER TABLE "t_nori_info" ALTER COLUMN "vendor" SET NOT NULL,
ALTER COLUMN "exhibition_date" SET NOT NULL,
ALTER COLUMN "exhibition_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "t_combo_items" ADD CONSTRAINT "t_combo_items_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "t_combo"("combo_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "t_detection_indicators" ADD CONSTRAINT "t_detection_indicators_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "t_detection_category"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "t_detection_indicators" ADD CONSTRAINT "t_detection_indicators_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "t_combo"("combo_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "t_nori_detection" ADD CONSTRAINT "t_nori_detection_nori_id_fkey" FOREIGN KEY ("nori_id") REFERENCES "t_nori_info"("nori_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "t_nori_detection" ADD CONSTRAINT "t_nori_detection_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "t_detection_indicators"("indicator_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "t_nori_detection" ADD CONSTRAINT "t_nori_detection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "t_users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "t_nori_info" ADD CONSTRAINT "t_nori_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "t_users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "t_nori_category" ADD CONSTRAINT "t_nori_category_nori_id_fkey" FOREIGN KEY ("nori_id") REFERENCES "t_nori_info"("nori_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "t_nori_category" ADD CONSTRAINT "t_nori_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "t_detection_category"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
