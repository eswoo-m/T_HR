/*
  Warnings:

  - Added the required column `employee_id` to the `employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_no` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "employee_id" TEXT NOT NULL,
ADD COLUMN     "employee_no" INTEGER NOT NULL;
