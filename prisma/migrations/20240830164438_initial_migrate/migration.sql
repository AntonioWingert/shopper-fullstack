-- CreateTable
CREATE TABLE `Measures` (
    `id` VARCHAR(36) NOT NULL,
    `measure_value` INTEGER NOT NULL,
    `measure_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `measure_type` VARCHAR(191) NOT NULL DEFAULT 'WATER',
    `customer_code` VARCHAR(191) NOT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
