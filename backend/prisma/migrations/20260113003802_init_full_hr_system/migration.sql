-- CreateTable
CREATE TABLE "certificate" (
    "id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "cert_type" TEXT NOT NULL,
    "cert_name" TEXT NOT NULL,
    "issuing_authority" TEXT NOT NULL,
    "acquisition_date" TIMESTAMP(3) NOT NULL,
    "exp_date" TIMESTAMP(3),
    "reg_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
