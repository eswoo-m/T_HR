/*
  Warnings:

  - You are about to drop the `pre_employment_project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pre_employment_project" DROP CONSTRAINT "pre_employment_project_employee_id_fkey";

-- DropTable
DROP TABLE "pre_employment_project";

-- CreateTable
CREATE TABLE "Pre_project_assignment" (
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

    CONSTRAINT "Pre_project_assignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pre_project_assignment" ADD CONSTRAINT "Pre_project_assignment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
