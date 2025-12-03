/*
  Warnings:

  - Added the required column `category_id` to the `Interest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `Interest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Interest` ADD COLUMN `category_id` INTEGER NOT NULL,
    ADD COLUMN `priority` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `InterestCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Interest` ADD CONSTRAINT `Interest_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `InterestCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
