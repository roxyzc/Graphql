-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" "STATUS" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Otp" (
    "otpId" VARCHAR(100) NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "otp" VARCHAR(6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("otpId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_userId_key" ON "Otp"("userId");

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
