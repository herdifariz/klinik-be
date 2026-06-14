/*
  Warnings:

  - The values [RECEPTION] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `fullName` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'DOCTOR', 'STAFF');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'DOCTOR';
COMMIT;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "fullName" VARCHAR(255) NOT NULL;
