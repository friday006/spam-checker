/*
  Warnings:

  - You are about to drop the column `isSpam` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Spam` table. All the data in the column will be lost.
  - Added the required column `reportedById` to the `Spam` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_userId_fkey";

-- DropForeignKey
ALTER TABLE "Spam" DROP CONSTRAINT "Spam_userId_fkey";

-- DropIndex
DROP INDEX "Spam_phone_key";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "isSpam",
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Spam" DROP COLUMN "userId",
ADD COLUMN     "reportedById" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_UserContacts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserContacts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserContacts_B_index" ON "_UserContacts"("B");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spam" ADD CONSTRAINT "Spam_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserContacts" ADD CONSTRAINT "_UserContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserContacts" ADD CONSTRAINT "_UserContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
