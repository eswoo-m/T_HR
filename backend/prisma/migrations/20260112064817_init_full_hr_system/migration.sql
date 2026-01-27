/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "employee_employee_id_key" ON "employee"("employee_id");
