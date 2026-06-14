import { Prisma, Prescription } from '@prisma/client';
import prisma from '../config/database';

export const create = async (data: Prisma.PrescriptionCreateInput): Promise<Prescription> => {
  return prisma.prescription.create({
    data,
    include: {
      items: {
        include: {
          medicine: true,
        },
      },
    },
  });
};

export const findById = async (id: string): Promise<Prescription | null> => {
  return prisma.prescription.findUnique({
    where: { id },
    include: {
      patient: { select: { fullName: true } },
      doctor: { include: { user: { select: { fullName: true } } } },
      items: {
        include: {
          medicine: true,
        },
      },
    },
  });
};

export const findMany = async (params: {
  skip?: number;
  take?: number;
  where?: Prisma.PrescriptionWhereInput;
  orderBy?: Prisma.PrescriptionOrderByWithRelationInput;
}): Promise<Prescription[]> => {
  return prisma.prescription.findMany({
    ...params,
    include: {
      patient: { select: { fullName: true } },
      doctor: { include: { user: { select: { fullName: true } } } },
      _count: {
        select: { items: true }
      }
    },
  });
};

export const count = async (where?: Prisma.PrescriptionWhereInput): Promise<number> => {
  return prisma.prescription.count({ where });
};

export const prescriptionRepository = {
  create,
  findById,
  findMany,
  count,
};

export default prescriptionRepository;
