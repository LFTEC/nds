-- CreateTable
CREATE TABLE "t_combo" (
    "combo_id" SERIAL NOT NULL,
    "combo_name" VARCHAR(50),
    "multi_select" BOOLEAN,

    CONSTRAINT "t_combo_pk" PRIMARY KEY ("combo_id")
);

-- CreateTable
CREATE TABLE "t_combo_items" (
    "item_id" SERIAL NOT NULL,
    "combo_id" INTEGER,
    "item_name" VARCHAR(50),
    "is_abnormal" BOOLEAN,
    "abnormal_text" TEXT,

    CONSTRAINT "t_combo_items_pk" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "t_detection_catgory" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(50),
    "serial_no" INTEGER,
    "create_date" DATE,
    "create_user" VARCHAR(20),
    "change_date" DATE,
    "change_user" VARCHAR(20),
    "invisible" BOOLEAN,

    CONSTRAINT "t_detection_catgory_pk" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "t_detection_indicators" (
    "indicator_id" SERIAL NOT NULL,
    "indicator_name" VARCHAR(50),
    "serial_no" INTEGER,
    "invisible" BOOLEAN,
    "category_id" INTEGER,
    "type" VARCHAR(10),
    "is_abnormal_text" BOOLEAN,
    "threshold_low" DECIMAL(11,2),
    "threshold_high" DECIMAL(11,2),
    "unit" VARCHAR(10),
    "abnormal_text" TEXT,
    "combo_id" INTEGER,

    CONSTRAINT "t_detection_indicators_pk" PRIMARY KEY ("indicator_id")
);

-- CreateTable
CREATE TABLE "t_nori_detection" (
    "nori_id" VARCHAR(20) NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "data_string" VARCHAR(50),
    "data_num" DECIMAL(11,2),
    "invisible" BOOLEAN,
    "data_pic" BYTEA,
    "data_bool" BOOLEAN,
    "abnormal_text" TEXT,
    "combo_item_id" INTEGER,
    "user_id" VARCHAR(20),
    "create_date" DATE,

    CONSTRAINT "t_nori_detection_pk" PRIMARY KEY ("nori_id","indicator_id")
);

-- CreateTable
CREATE TABLE "t_nori_detection_combo_item" (
    "nori_id" VARCHAR(20) NOT NULL,
    "indicator_id" INTEGER NOT NULL,
    "item_id" INTEGER,
    "abnormal_text" TEXT,

    CONSTRAINT "t_nori_detection_combo_item_pk" PRIMARY KEY ("nori_id","indicator_id")
);

-- CreateTable
CREATE TABLE "t_nori_info" (
    "nori_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "vendor" VARCHAR(50),
    "exhibition_date" DATE,
    "exhibition_id" VARCHAR(20),
    "production_date" DATE,
    "maritime" VARCHAR(20),
    "box_quantity" INTEGER,

    CONSTRAINT "t_nori_info_pk" PRIMARY KEY ("nori_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "t_nori_info_unique" ON "t_nori_info"("vendor", "exhibition_date", "exhibition_id");

