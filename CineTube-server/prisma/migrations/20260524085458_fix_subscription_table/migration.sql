/*
  Warnings:

  - Added the required column `updated_at` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'PENDING';

-- DropIndex
DROP INDEX "subscriptions_stripe_payment_id_key";

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "activation_otp" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "otp_expires_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "start_date" DROP NOT NULL,
ALTER COLUMN "start_date" DROP DEFAULT,
ALTER COLUMN "end_date" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");
