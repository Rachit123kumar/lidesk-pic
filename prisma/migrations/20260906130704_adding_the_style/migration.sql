-- CreateTable
CREATE TABLE "Style" (
    "id" TEXT NOT NULL,
    "styleName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "images" TEXT[],
    "prompt" TEXT NOT NULL,
    "tags" TEXT[],
    "description" TEXT,
    "advice" TEXT,
    "generationCost" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL DEFAULT 'Admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Style_slug_key" ON "Style"("slug");

-- CreateIndex
CREATE INDEX "Style_styleName_idx" ON "Style"("styleName");
