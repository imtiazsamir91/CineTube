-- CreateEnum
CREATE TYPE "VideoQuality" AS ENUM ('SD', 'HD', 'FHD', 'ULTRA_HD');

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "videoQuality" "VideoQuality" NOT NULL DEFAULT 'FHD';
