-- CreateEnum
CREATE TYPE "ACCESS" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Diary" (
    "diaryId" VARCHAR(100) NOT NULL,
    "access" "ACCESS" NOT NULL DEFAULT 'PUBLIC',
    "title" VARCHAR(100) NOT NULL,
    "content" VARCHAR(5000) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diary_pkey" PRIMARY KEY ("diaryId")
);

-- AddForeignKey
ALTER TABLE "Diary" ADD CONSTRAINT "Diary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;