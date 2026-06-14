import { Prisma, Patient } from '@prisma/client';
import prisma from '../config/database';

export const create = async (data: Prisma.PatientCreateInput): Promise<Patient> => {
  return prisma.patient.create({
    data,
  });
};

export const findById = async (id: string): Promise<Patient | null> => {
  return prisma.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        take: 5,
        orderBy: { appointmentDateTime: 'desc' },
        include: { doctor: { include: { user: { select: { fullName: true } } } } },
      },
      medicalRecords: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

export const findMany = async (params: {
  skip?: number;
  take?: number;
  where?: Prisma.PatientWhereInput;
  orderBy?: Prisma.PatientOrderByWithRelationInput;
}): Promise<Patient[]> => {
  return prisma.patient.findMany({
    ...params,
  });
};

export const count = async (where?: Prisma.PatientWhereInput): Promise<number> => {
  return prisma.patient.count({ where });
};

export const update = async (id: string, data: Prisma.PatientUpdateInput): Promise<Patient> => {
  return prisma.patient.update({
    where: { id },
    data,
  });
};

export const remove = async (id: string): Promise<Patient> => {
  return prisma.patient.delete({
    where: { id },
  });
};

export const patientRepository = {
  create,
  findById,
  findMany,
  count,
  update,
  remove,
};

export default patientRepository;
