-- CreateEnum
CREATE TYPE "Type" AS ENUM ('male', 'female', 'both');

-- AlterTable
ALTER TABLE "Style" ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'both';
