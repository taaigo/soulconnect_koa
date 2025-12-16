/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Interest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `InterestCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `InterestCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `InterestCategory` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Interest_name_key` ON `Interest`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `InterestCategory_name_key` ON `InterestCategory`(`name`);
