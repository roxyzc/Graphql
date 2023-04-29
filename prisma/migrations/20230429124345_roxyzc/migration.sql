/*
  Warnings:

  - You are about to drop the column `active` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpOtpId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "expiredAt" TIMESTAMP(3),
ALTER COLUMN "otp" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "active",
DROP COLUMN "otpOtpId",
ADD COLUMN     "expiredAt" DATE,
ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
