/*
  Warnings:

  - A unique constraint covering the columns `[resident_no]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "employee_resident_no_key" ON "employee"("resident_no");
