-- AlterTable
ALTER TABLE `User` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verificationExpiry` DATETIME(3) NULL,
    ADD COLUMN `verificationToken` VARCHAR(191) NULL;
