-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "t_combo" (
    "combo_id" SERIAL NOT NULL,
    "combo_name" VARCHAR(50),
    "isOption" BOOLEAN,

    CONSTRAINT "t_combo_pk" PRIMARY KEY ("combo_id")
);

-- CreateTable
CREATE TABLE "t_combo_items" (
    "item_id" SERIAL NOT NULL,
    "combo_id" INTEGER NOT NULL,
    "item_name" VARCHAR(50) NOT NULL,
    "is_abnormal" BOOLEAN NOT NULL,
    "serial_no" INTEGER,

    CONSTRAINT "t_combo_items_pk" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "t_detection_indicators" (
    "indicator_id" SERIAL NOT NULL,
    "indicator_name" VARCHAR(50) NOT NULL,
    "serial_no" INTEGER,
    "no_detection" BOOLEAN NOT NULL,
    "category_id" INTEGER NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "has_suggestion_text" BOOLEAN NOT NULL,
    "threshold_low" DECIMAL(11,2),
    "threshold_high" DECIMAL(11,2),
    "unit" VARCHAR(10) NOT NULL,
    "suggestion_text" TEXT,
    "combo_id" INTEGER,

    CONSTRAINT "t_detection_indicators_pk" PRIMARY KEY ("indicator_id")
);

-- CreateTable
CREATE TABLE "t_nori_detection" (
    "nori_id" VARCHAR(20) NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "data_string" VARCHAR(50),
    "data_num" DECIMAL(11,2),
    "detection_result" VARCHAR(1),
    "data_pic" BYTEA,
    "data_bool" BOOLEAN,
    "suggestion_text" TEXT,
    "user_id" VARCHAR(20),
    "create_date" DATE,
    "data_item" INTEGER,
    "detection_date" DATE,

    CONSTRAINT "t_nori_detection_pk" PRIMARY KEY ("nori_id","indicator_id")
);

-- CreateTable
CREATE TABLE "t_nori_info" (
    "nori_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "vendor" VARCHAR(50) NOT NULL,
    "exhibition_date" DATE NOT NULL,
    "exhibition_id" VARCHAR(20) NOT NULL,
    "production_date" DATE,
    "maritime" VARCHAR(20),
    "box_quantity" INTEGER,
    "batch_no" VARCHAR(20) NOT NULL,
    "user_id" UUID NOT NULL,
    "create_date" DATE,
    "detection_date" DATE,
    "complete_date" DATE,
    "level" VARCHAR(10),

    CONSTRAINT "t_nori_info_pk" PRIMARY KEY ("nori_id")
);

-- CreateTable
CREATE TABLE "t_detection_category" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(50),
    "serial_no" INTEGER,
    "invisible" BOOLEAN,

    CONSTRAINT "t_detection_catgory_pk" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "t_nori_category" (
    "nori_id" UUID NOT NULL,
    "category_id" INTEGER NOT NULL,
    "noDetection" BOOLEAN,

    CONSTRAINT "t_nori_category_pk" PRIMARY KEY ("nori_id","category_id")
);

-- CreateTable
CREATE TABLE "t_users" (
    "user_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_name" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50),
    "email" VARCHAR(100),
    "password" TEXT,

    CONSTRAINT "users_pk" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "t_nori_info_unique" ON "t_nori_info"("vendor", "exhibition_date", "exhibition_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_unique" ON "t_users"("user_name");

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

