import { Prisma, Medicine } from '@prisma/client';
import prisma from '../config/database';

export const create = async (data: Prisma.MedicineCreateInput): Promise<Medicine> => {
  return prisma.medicine.create({ data });
};

export const findById = async (id: string): Promise<Medicine | null> => {
  return prisma.medicine.findUnique({
    where: { id },
  });
};

export const findByCode = async (code: string): Promise<Medicine | null> => {
  return prisma.medicine.findUnique({
    where: { code },
  });
};

export const findMany = async (params: {
  skip?: number;
  take?: number;
  where?: Prisma.MedicineWhereInput;
  orderBy?: Prisma.MedicineOrderByWithRelationInput;
}): Promise<Medicine[]> => {
  return prisma.medicine.findMany(params);
};

export const count = async (where?: Prisma.MedicineWhereInput): Promise<number> => {
  return prisma.medicine.count({ where });
};

export const update = async (id: string, data: Prisma.MedicineUpdateInput): Promise<Medicine> => {
  return prisma.medicine.update({
    where: { id },
    data,
  });
};

export const remove = async (id: string): Promise<Medicine> => {
  return prisma.medicine.delete({
    where: { id },
  });
};

export const medicineRepository = {
  create,
  findById,
  findByCode,
  findMany,
  count,
  update,
  remove,
};

export default medicineRepository;
