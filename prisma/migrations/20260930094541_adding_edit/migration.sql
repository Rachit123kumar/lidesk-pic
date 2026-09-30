-- DropIndex
DROP INDEX "SupportConversation_updatedAt_idx";

-- AlterTable
ALTER TABLE "SupportConversation" ADD COLUMN     "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "SupportConversation_lastMessageAt_idx" ON "SupportConversation"("lastMessageAt");
