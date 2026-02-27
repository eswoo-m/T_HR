-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "deptId" INTEGER,
    "position" TEXT,
    "role" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" INTEGER,
    "start_date" DATE NOT NULL,
    "end_date" DATE DEFAULT '9999-12-31 00:00:00 +00:00',
    "desc" TEXT,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "seq" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "employee_no" TEXT NOT NULL,
    "name_kr" TEXT NOT NULL,
    "name_en" TEXT,
    "name_zh" TEXT,
    "resident_no" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "is_lunar" BOOLEAN NOT NULL DEFAULT false,
    "gender" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "department_id" INTEGER,
    "team_id" INTEGER,
    "dept_id" INTEGER,
    "job_level" TEXT,
    "job_role" TEXT,
    "assign_status" TEXT,
    "auth_level" TEXT NOT NULL DEFAULT 'USER',
    "email" TEXT,
    "join_date" DATE NOT NULL,
    "exit_date" DATE,
    "phone" TEXT
);

-- CreateTable
CREATE TABLE "employee_detail" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT '정규직',
    "hr_status" TEXT NOT NULL DEFAULT '재직',
    "skill_level" TEXT NOT NULL DEFAULT '초급',
    "leave_start_date" DATE,
    "leave_end_date" DATE,
    "edu_level" TEXT,
    "last_school" TEXT,
    "major" TEXT,
    "entrance_date" DATE,
    "graduation_date" DATE,
    "total_sw_experience" INTEGER DEFAULT 0,
    "prev_sw_experience" INTEGER DEFAULT 0,
    "marital_status" TEXT,
    "wedding_anniv" DATE,
    "emergency_phone" TEXT,
    "emergency_relation" TEXT,
    "zip_code" TEXT,
    "address" TEXT,
    "address_detail" TEXT,
    "remarks" TEXT,
    "profile_path" TEXT,
    "commonCodeId" INTEGER,

    CONSTRAINT "employee_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_organization_history" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "team_id" INTEGER,
    "job_level" TEXT,
    "job_role" TEXT,
    "apply_date" DATE NOT NULL,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_organization_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "previous_experience" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "department" TEXT,
    "jobLevel" TEXT,
    "job_role" TEXT,
    "relevance" TEXT NOT NULL DEFAULT '유관',
    "entrance_date" DATE NOT NULL,
    "resignation_date" DATE,
    "assigned_task" TEXT,
    "resignation_reason" TEXT,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "previous_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT,
    "name" TEXT NOT NULL,
    "type_id" TEXT,
    "vendor" TEXT,
    "model" TEXT,
    "number" TEXT,
    "serial_no" TEXT,
    "purchase_date" DATE,
    "purchase_amount" DECIMAL(12,2),
    "warranty_date" DATE,
    "status" TEXT,
    "assign_date" DATE,
    "regist_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assetTypeId" INTEGER,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assets_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "business_no" TEXT NOT NULL,
    "ceo_name" TEXT,
    "industry" TEXT,
    "tel" TEXT,
    "fax" TEXT,
    "address" TEXT,
    "homepage" TEXT,
    "status" TEXT NOT NULL DEFAULT '활성',
    "remarks" TEXT,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "tel" TEXT,
    "jobRole" TEXT,
    "department" TEXT,
    "remarks" TEXT,
    "customer_id" INTEGER NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_contact" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "contact_id" INTEGER NOT NULL,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_ability" (
    "employee_id" TEXT NOT NULL,
    "communication_skill" TEXT,
    "office_skill" TEXT,
    "test_design" TEXT,
    "test_execution" TEXT,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
CREATE TABLE "pre_project_assignment" (
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
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pre_project_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "customer_id" INTEGER,
    "team_id" INTEGER,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" DATE,
    "end_date" DATE,
    "headcount" INTEGER DEFAULT 0,
    "amount" DECIMAL(15,2) NOT NULL,
    "status" TEXT,
    "location" TEXT,
    "task_name" TEXT,
    "task_summary" TEXT,
    "remarks" TEXT,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_assignment" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "assigned_role" TEXT,
    "tools" TEXT,
    "work_detail" TEXT,
    "contribution" TEXT,

    CONSTRAINT "project_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_assignment_period" (
    "id" SERIAL NOT NULL,
    "assignment_id" INTEGER NOT NULL,
    "status" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_assignment_period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_monthly_mm" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "year_month" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "assignStatus" TEXT,
    "value" DECIMAL(5,2) NOT NULL,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_monthly_mm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_code" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT true,
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "common_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "cert_type" TEXT NOT NULL,
    "cert_name" TEXT NOT NULL,
    "issuing_authority" TEXT NOT NULL,
    "acquisition_date" TIMESTAMP(3) NOT NULL,
    "exp_date" TIMESTAMP(3),
    "reg_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachment" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "ref_id" INTEGER,
    "ref_type" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploader_id" TEXT NOT NULL,
    "certificateId" INTEGER,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "organization_parent_id_idx" ON "organization"("parent_id");

-- CreateIndex
CREATE INDEX "organization_start_date_end_date_idx" ON "organization"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "organization_name_idx" ON "organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "employee_id_key" ON "employee"("id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_employee_no_key" ON "employee"("employee_no");

-- CreateIndex
CREATE UNIQUE INDEX "employee_resident_no_key" ON "employee"("resident_no");

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

-- CreateIndex
CREATE UNIQUE INDEX "employee_detail_employee_id_key" ON "employee_detail"("employee_id");

-- CreateIndex
CREATE INDEX "previous_experience_employee_id_idx" ON "previous_experience"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_business_no_key" ON "customer"("business_no");

-- CreateIndex
CREATE UNIQUE INDEX "project_contact_project_id_contact_id_key" ON "project_contact"("project_id", "contact_id");

-- CreateIndex
CREATE INDEX "project_customer_id_idx" ON "project"("customer_id");

-- CreateIndex
CREATE INDEX "project_team_id_idx" ON "project"("team_id");

-- CreateIndex
CREATE INDEX "project_start_date_end_date_idx" ON "project"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "project_reg_time_idx" ON "project"("reg_time");

-- CreateIndex
CREATE UNIQUE INDEX "project_customer_id_name_key" ON "project"("customer_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "common_code_type_code_key" ON "common_code"("type", "code");

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_detail" ADD CONSTRAINT "employee_detail_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_detail" ADD CONSTRAINT "employee_detail_commonCodeId_fkey" FOREIGN KEY ("commonCodeId") REFERENCES "common_code"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_organization_history" ADD CONSTRAINT "employee_organization_history_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_organization_history" ADD CONSTRAINT "employee_organization_history_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_organization_history" ADD CONSTRAINT "employee_organization_history_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "previous_experience" ADD CONSTRAINT "previous_experience_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_assetTypeId_fkey" FOREIGN KEY ("assetTypeId") REFERENCES "assets_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_contact" ADD CONSTRAINT "customer_contact_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_contact" ADD CONSTRAINT "project_contact_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_contact" ADD CONSTRAINT "project_contact_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "customer_contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technical_ability" ADD CONSTRAINT "technical_ability_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_tool" ADD CONSTRAINT "employee_tool_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pre_project_assignment" ADD CONSTRAINT "pre_project_assignment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_assignment" ADD CONSTRAINT "project_assignment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_assignment" ADD CONSTRAINT "project_assignment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_assignment_period" ADD CONSTRAINT "project_assignment_period_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "project_assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_monthly_mm" ADD CONSTRAINT "employee_monthly_mm_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "certificate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
