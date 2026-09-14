-- AlterTable
ALTER TABLE "Generation" ADD COLUMN     "coinCost" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "coinsRefunded" BOOLEAN NOT NULL DEFAULT false;
