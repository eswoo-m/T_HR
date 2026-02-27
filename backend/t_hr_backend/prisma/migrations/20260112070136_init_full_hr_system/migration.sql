/*
  Warnings:

  - The primary key for the `employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `employee_id` on the `employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "assets" DROP CONSTRAINT "assets_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "employee_department_history" DROP CONSTRAINT "employee_department_history_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "employee_detail" DROP CONSTRAINT "employee_detail_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "employee_monthly_mm" DROP CONSTRAINT "employee_monthly_mm_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "project_assignment" DROP CONSTRAINT "project_assignment_employee_id_fkey";

-- DropIndex
DROP INDEX "employee_employee_id_key";

-- AlterTable
ALTER TABLE "assets" ALTER COLUMN "employee_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "employee" DROP CONSTRAINT "employee_pkey",
DROP COLUMN "employee_id",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "employee_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "employee_id_seq";

-- AlterTable
ALTER TABLE "employee_department_history" ALTER COLUMN "employee_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "employee_detail" ALTER COLUMN "employee_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "employee_monthly_mm" ALTER COLUMN "employee_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "project_assignment" ALTER COLUMN "employee_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "employee_department_history" ADD CONSTRAINT "employee_department_history_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_detail" ADD CONSTRAINT "employee_detail_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_assignment" ADD CONSTRAINT "project_assignment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_monthly_mm" ADD CONSTRAINT "employee_monthly_mm_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
