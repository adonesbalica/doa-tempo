/*
  Warnings:

  - A unique constraint covering the columns `[userId,opportunityId]` on the table `application` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "application_userId_opportunityId_key" ON "application"("userId", "opportunityId");
