import medicineRepository from '../repositories/medicine.repository';
import { CreateMedicineInput, UpdateMedicineInput, ListMedicinesQuery } from '../schemas/medicine.schema';
import { Medicine, Prisma } from '@prisma/client';

export const createMedicine = async (data: CreateMedicineInput): Promise<Medicine> => {
  const existingMedicine = await medicineRepository.findByCode(data.code);
  if (existingMedicine) {
    const error: any = new Error('Medicine with this code already exists');
    error.statusCode = 409;
    throw error;
  }

  return medicineRepository.create(data as Prisma.MedicineCreateInput);
};

export const listMedicines = async (query: ListMedicinesQuery) => {
  const { page, limit, search, category, inStock, sortBy, order } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.MedicineWhereInput = {};
  if (category) where.category = { contains: category, mode: 'insensitive' };
  if (inStock) where.stock = { gt: 0 };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
      { genericName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [medicines, total] = await Promise.all([
    medicineRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy: { [sortBy]: order },
    }),
    medicineRepository.count(where),
  ]);

  return {
    medicines,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getMedicineById = async (id: string): Promise<Medicine> => {
  const medicine = await medicineRepository.findById(id);
  if (!medicine) {
    const error: any = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }
  return medicine;
};

export const updateMedicine = async (id: string, data: UpdateMedicineInput): Promise<Medicine> => {
  const medicine = await medicineRepository.findById(id);
  if (!medicine) {
    const error: any = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }

  if (data.code && data.code !== medicine.code) {
    const existingCode = await medicineRepository.findByCode(data.code);
    if (existingCode) {
      const error: any = new Error('Medicine code already in use');
      error.statusCode = 409;
      throw error;
    }
  }

  return medicineRepository.update(id, data as Prisma.MedicineUpdateInput);
};

export const medicineService = {
  createMedicine,
  listMedicines,
  getMedicineById,
  updateMedicine,
};

export default medicineService;
