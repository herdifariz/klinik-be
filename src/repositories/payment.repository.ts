import { Prisma, Payment } from '@prisma/client';
import prisma from '../config/database';

export const create = async (data: Prisma.PaymentCreateInput): Promise<Payment> => {
  return prisma.payment.create({
    data,
    include: {
      patient: { select: { fullName: true } },
      appointment: { include: { doctor: { include: { user: { select: { fullName: true } } } } } },
    },
  });
};

export const findById = async (id: string): Promise<Payment | null> => {
  return prisma.payment.findUnique({
    where: { id },
    include: {
      patient: { select: { fullName: true } },
      appointment: { 
        include: { 
          doctor: { include: { user: { select: { fullName: true } } } },
          prescriptions: { include: { items: { include: { medicine: true } } } }
        } 
      },
    },
  });
};

export const findMany = async (params: {
  skip?: number;
  take?: number;
  where?: Prisma.PaymentWhereInput;
  orderBy?: Prisma.PaymentOrderByWithRelationInput;
}): Promise<Payment[]> => {
  return prisma.payment.findMany({
    ...params,
    include: {
      patient: { select: { fullName: true } },
      appointment: true,
    },
  });
};

export const count = async (where?: Prisma.PaymentWhereInput): Promise<number> => {
  return prisma.payment.count({ where });
};

export const update = async (id: string, data: Prisma.PaymentUpdateInput): Promise<Payment> => {
  return prisma.payment.update({
    where: { id },
    data,
    include: {
      patient: { select: { fullName: true } },
      appointment: { 
        include: { 
          doctor: { include: { user: { select: { fullName: true } } } },
          prescriptions: { include: { items: { include: { medicine: true } } } }
        } 
      },
    },
  });
};

export const paymentRepository = {
  create,
  findById,
  findMany,
  count,
  update,
};

export default paymentRepository;
