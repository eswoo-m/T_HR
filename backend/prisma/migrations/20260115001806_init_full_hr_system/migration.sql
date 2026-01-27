/*
  Warnings:

  - You are about to drop the column `department_id` on the `employee` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ExperienceRelevance" AS ENUM ('RELEVANT', 'IRRELEVANT', 'SIMILAR');

-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_department_id_fkey";

-- AlterTable
ALTER TABLE "PreviousExperience" ADD COLUMN     "relevance" "ExperienceRelevance" NOT NULL DEFAULT 'RELEVANT';

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "department_id",
ADD COLUMN     "dept_id" INTEGER,
ADD COLUMN     "division_id" INTEGER,
ADD COLUMN     "team_id" INTEGER;

-- AlterTable
ALTER TABLE "employee_detail" ADD COLUMN     "entrance_date" DATE,
ADD COLUMN     "graduation_date" DATE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
