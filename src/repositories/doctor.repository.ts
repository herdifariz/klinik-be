import { Prisma, Doctor } from '@prisma/client';
import prisma from '../config/database';

export const create = async (data: Prisma.DoctorCreateInput): Promise<Doctor> => {
  return prisma.doctor.create({
    data,
  });
};

export const findById = async (id: string): Promise<Doctor | null> => {
  return prisma.doctor.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          isActive: true,
        },
      },
      // You can add schedules relation here if implemented in schema
    },
  });
};

export const findByUserId = async (userId: string): Promise<Doctor | null> => {
  return prisma.doctor.findUnique({
    where: { userId },
  });
};

export const findMany = async (params: {
  skip?: number;
  take?: number;
  where?: Prisma.DoctorWhereInput;
  orderBy?: Prisma.DoctorOrderByWithRelationInput;
}): Promise<Doctor[]> => {
  return prisma.doctor.findMany({
    ...params,
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
  });
};

export const count = async (where?: Prisma.DoctorWhereInput): Promise<number> => {
  return prisma.doctor.count({ where });
};

export const update = async (id: string, data: Prisma.DoctorUpdateInput): Promise<Doctor> => {
  return prisma.doctor.update({
    where: { id },
    data,
  });
};

export const doctorRepository = {
  create,
  findById,
  findByUserId,
  findMany,
  count,
  update,
};

export default doctorRepository;
