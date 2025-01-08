/*
  Warnings:

  - You are about to drop the column `captainId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `_TeamUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_captainId_fkey";

-- DropForeignKey
ALTER TABLE "_TeamUsers" DROP CONSTRAINT "_TeamUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamUsers" DROP CONSTRAINT "_TeamUsers_B_fkey";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "captainId";

-- DropTable
DROP TABLE "_TeamUsers";
