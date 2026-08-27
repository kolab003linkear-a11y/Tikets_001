/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dni` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dni" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Stadium" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stadium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "stadiumId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "totalTickets" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_stadiumId_fkey" FOREIGN KEY ("stadiumId") REFERENCES "Stadium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
