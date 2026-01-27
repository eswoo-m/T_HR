/*
  Warnings:

  - You are about to drop the column `vender` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `attachment` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `attachment` table. All the data in the column will be lost.
  - The primary key for the `employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `auth_role` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `division_id` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `employee` table. All the data in the column will be lost.
  - The `gender` column on the `employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `end_date` on the `employee_department_history` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `employee_department_history` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `employee_department_history` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `employee_department_history` table. All the data in the column will be lost.
  - You are about to drop the column `employee_status` on the `employee_detail` table. All the data in the column will be lost.
  - You are about to drop the column `employee_type` on the `employee_detail` table. All the data in the column will be lost.
  - The `marital_status` column on the `employee_detail` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `status` on the `employee_monthly_mm` table. All the data in the column will be lost.
  - You are about to drop the column `update_time` on the `employee_monthly_mm` table. All the data in the column will be lost.
  - You are about to drop the column `communication` on the `technical_ability` table. All the data in the column will be lost.
  - You are about to drop the `PreviousExperience` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[seq]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employee_no]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employee_id` to the `attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_path` to the `attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_type` to the `attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apply_date` to the `employee_department_history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PreviousExperience" DROP CONSTRAINT "PreviousExperience_employee_id_fkey";

-- AlterTable
ALTER TABLE "assets" DROP COLUMN "vender",
ADD COLUMN     "vendor" TEXT;

-- AlterTable
ALTER TABLE "attachment" DROP COLUMN "filePath",
DROP COLUMN "fileType",
ADD COLUMN     "employee_id" TEXT NOT NULL,
ADD COLUMN     "file_path" VARCHAR(500) NOT NULL,
ADD COLUMN     "file_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "department" ALTER COLUMN "end_date" SET DEFAULT '9999-12-31 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "employee" DROP CONSTRAINT "employee_pkey",
DROP COLUMN "auth_role",
DROP COLUMN "division_id",
DROP COLUMN "level",
DROP COLUMN "role",
DROP COLUMN "status",
ADD COLUMN     "assign_status" TEXT,
ADD COLUMN     "auth_level" TEXT NOT NULL DEFAULT 'USER',
ADD COLUMN     "department_id" INTEGER,
ADD COLUMN     "job_level" TEXT,
ADD COLUMN     "job_role" TEXT,
ADD COLUMN     "seq" SERIAL NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT NOT NULL DEFAULT 'UNKNOWN',
ALTER COLUMN "employee_no" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "employee_department_history" DROP COLUMN "end_date",
DROP COLUMN "level",
DROP COLUMN "role",
DROP COLUMN "start_date",
ADD COLUMN     "apply_date" DATE NOT NULL,
ADD COLUMN     "job_level" TEXT,
ADD COLUMN     "job_role" TEXT,
ADD COLUMN     "team_id" INTEGER;

-- AlterTable
ALTER TABLE "employee_detail" DROP COLUMN "employee_status",
DROP COLUMN "employee_type",
ADD COLUMN     "hr_status" TEXT NOT NULL DEFAULT 'EMPLOYED',
ADD COLUMN     "profile_path" TEXT,
ADD COLUMN     "skill_level" TEXT NOT NULL DEFAULT 'SKL001',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'REGULAR',
DROP COLUMN "marital_status",
ADD COLUMN     "marital_status" TEXT NOT NULL DEFAULT 'SINGLE';

-- AlterTable
ALTER TABLE "employee_monthly_mm" DROP COLUMN "status",
DROP COLUMN "update_time",
ADD COLUMN     "assignStatus" TEXT,
ADD COLUMN     "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "technical_ability" DROP COLUMN "communication",
ADD COLUMN     "communication_skill" TEXT;

-- DropTable
DROP TABLE "PreviousExperience";

-- DropEnum
DROP TYPE "AttachmentType";

-- DropEnum
DROP TYPE "AuthRole";

-- DropEnum
DROP TYPE "EmpStatus";

-- DropEnum
DROP TYPE "EmpType";

-- DropEnum
DROP TYPE "ExperienceRelevance";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "MaritalStatus";

-- DropEnum
DROP TYPE "RefType";

-- CreateTable
CREATE TABLE "previous_experience" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "department" TEXT,
    "jobLevel" TEXT,
    "job_role" TEXT,
    "relevance" TEXT NOT NULL DEFAULT 'RELEVANT',
    "entrance_date" DATE NOT NULL,
    "resignation_date" DATE,
    "assigned_task" TEXT,
    "resignation_reason" TEXT,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "previous_experience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "previous_experience_employee_id_idx" ON "previous_experience"("employee_id");

-- CreateIndex
CREATE INDEX "department_parent_id_idx" ON "department"("parent_id");

-- CreateIndex
CREATE INDEX "department_start_date_end_date_idx" ON "department"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "department_name_idx" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "employee_seq_key" ON "employee"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "employee_id_key" ON "employee"("id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_employee_no_key" ON "employee"("employee_no");

-- CreateIndex
CREATE INDEX "employee_id_idx" ON "employee"("id");

-- CreateIndex
CREATE INDEX "employee_employee_no_idx" ON "employee"("employee_no");

-- CreateIndex
CREATE INDEX "employee_department_id_team_id_idx" ON "employee"("department_id", "team_id");

-- CreateIndex
CREATE INDEX "employee_name_kr_idx" ON "employee"("name_kr");

-- CreateIndex
CREATE INDEX "employee_assign_status_auth_level_idx" ON "employee"("assign_status", "auth_level");

-- CreateIndex
CREATE INDEX "employee_join_date_idx" ON "employee"("join_date");

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_department_history" ADD CONSTRAINT "employee_department_history_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "previous_experience" ADD CONSTRAINT "previous_experience_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
