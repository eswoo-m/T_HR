/*
  Warnings:

  - You are about to drop the column `task_type` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `create_time` on the `project_assignment_period` table. All the data in the column will be lost.
  - You are about to drop the column `update_time` on the `project_assignment_period` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project" DROP COLUMN "task_type";

-- AlterTable
ALTER TABLE "project_assignment" ALTER COLUMN "contribution" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "project_assignment_period" DROP COLUMN "create_time",
DROP COLUMN "update_time",
ADD COLUMN     "reg_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "technical_ability" (
    "employee_id" TEXT NOT NULL,
    "communication" TEXT,
    "office_skill" TEXT,
    "test_design" TEXT,
    "test_execution" TEXT,
    "reg_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technical_ability_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "employee_tool" (
    "employee_id" TEXT NOT NULL,
    "defect_system" TEXT,
    "messenger" TEXT,
    "api_tool" TEXT,
    "etc_tool" TEXT,
    "reg_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_tool_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "pre_employment_project" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "client_name" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "headcount" INTEGER DEFAULT 0,
    "task_name" TEXT,
    "task_summary" TEXT,
    "assigned_role" TEXT,
    "tools" TEXT,
    "work_detail" TEXT,
    "contribution" TEXT,
    "reg_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pre_employment_project_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "technical_ability" ADD CONSTRAINT "technical_ability_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_tool" ADD CONSTRAINT "employee_tool_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_employment_project" ADD CONSTRAINT "pre_employment_project_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
