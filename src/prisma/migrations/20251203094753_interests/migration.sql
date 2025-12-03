-- AlterTable
ALTER TABLE `UserProfile` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Interest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InterestsOnProfiles` (
    `profile_id` INTEGER NOT NULL,
    `interest_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`profile_id`, `interest_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InterestsOnProfiles` ADD CONSTRAINT `InterestsOnProfiles_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `UserProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InterestsOnProfiles` ADD CONSTRAINT `InterestsOnProfiles_interest_id_fkey` FOREIGN KEY (`interest_id`) REFERENCES `Interest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
