-- AlterTable
ALTER TABLE "User" ADD COLUMN     "categorias" TEXT[] DEFAULT ARRAY[]::TEXT[];
