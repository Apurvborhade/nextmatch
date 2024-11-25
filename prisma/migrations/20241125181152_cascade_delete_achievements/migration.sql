/*
  Warnings:

  - You are about to drop the column `skillsId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_teamId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "skillsId";

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
