-- AlterTable
ALTER TABLE "Generation" ADD COLUMN     "feedbackText" TEXT,
ADD COLUMN     "isFeedbacked" BOOLEAN NOT NULL DEFAULT false;
