-- CreateEnum
CREATE TYPE "EmpStatus" AS ENUM ('EMPLOYED', 'ON_LEAVE', 'RETIRED');

-- CreateEnum
CREATE TYPE "AuthRole" AS ENUM ('USER', 'MANAGER', 'MASTER', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('PROFILE_PHOTO', 'CERT_COPY', 'CONTRACT', 'OTHER');

-- CreateEnum
CREATE TYPE "RefType" AS ENUM ('EMPLOYEE', 'PROJECT', 'LICENSE');

-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "auth_role" "AuthRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "is_lunar" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "employee_detail" ADD COLUMN     "employee_status" "EmpStatus" NOT NULL DEFAULT 'EMPLOYED',
ADD COLUMN     "remarks" TEXT;

-- CreateTable
CREATE TABLE "PreviousExperience" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "department" TEXT,
    "position" TEXT,
    "job_role" TEXT,
    "entrance_date" DATE NOT NULL,
    "resignation_date" DATE,
    "assigned_task" TEXT,
    "resignation_reason" TEXT,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreviousExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachment" (
    "id" SERIAL NOT NULL,
    "uploader_id" TEXT NOT NULL,
    "ref_id" INTEGER,
    "ref_type" TEXT NOT NULL,
    "fileType" "AttachmentType" NOT NULL,
    "filePath" VARCHAR(500) NOT NULL,
    "fileName" TEXT NOT NULL,
    "certificateId" INTEGER,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PreviousExperience" ADD CONSTRAINT "PreviousExperience_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "certificate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
