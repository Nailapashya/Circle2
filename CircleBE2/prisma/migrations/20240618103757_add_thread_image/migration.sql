/*
  Warnings:

  - You are about to drop the column `image` on the `Thread` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "ThreadImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,

    CONSTRAINT "ThreadImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ThreadImage" ADD CONSTRAINT "ThreadImage_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
