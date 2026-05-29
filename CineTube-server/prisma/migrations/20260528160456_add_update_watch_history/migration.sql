-- AlterTable
ALTER TABLE "media" ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "watch_histories_updated_at_idx" ON "watch_histories"("updated_at");
