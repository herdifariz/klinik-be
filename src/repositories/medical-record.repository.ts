import { Prisma, MedicalRecord } from '@prisma/client';
import prisma from '../config/database';

export const create = async (data: Prisma.MedicalRecordCreateInput): Promise<MedicalRecord> => {
  return prisma.medicalRecord.create({
    data,
  });
};

export const findById = async (id: string): Promise<MedicalRecord | null> => {
  return prisma.medicalRecord.findUnique({
    where: { id },
    include: {
      patient: { select: { fullName: true } },
      doctor: { select: { fullName: true } },
      appointment: { select: { appointmentDateTime: true } },
    },
  });
};

export const findMany = async (params: {
  skip?: number;
  take?: number;
  where?: Prisma.MedicalRecordWhereInput;
  orderBy?: Prisma.MedicalRecordOrderByWithRelationInput;
}): Promise<MedicalRecord[]> => {
  return prisma.medicalRecord.findMany({
    ...params,
    include: {
      patient: { select: { fullName: true } },
      doctor: { select: { fullName: true } },
      appointment: { select: { appointmentDateTime: true } },
    },
  });
};

export const count = async (where?: Prisma.MedicalRecordWhereInput): Promise<number> => {
  return prisma.medicalRecord.count({ where });
};

export const update = async (id: string, data: Prisma.MedicalRecordUpdateInput): Promise<MedicalRecord> => {
  return prisma.medicalRecord.update({
    where: { id },
    data,
  });
};

export const medicalRecordRepository = {
  create,
  findById,
  findMany,
  count,
  update,
};

export default medicalRecordRepository;
