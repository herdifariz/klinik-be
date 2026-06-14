import { Prisma, Appointment, AppointmentStatus } from '@prisma/client';
import prisma from '../config/database';

export const create = async (data: Prisma.AppointmentCreateInput): Promise<Appointment> => {
  return prisma.appointment.create({
    data,
    include: {
      patient: { select: { fullName: true } },
      doctor: { include: { user: { select: { fullName: true } } } },
    },
  });
};

export const findById = async (id: string): Promise<Appointment | null> => {
  return prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: { select: { fullName: true } },
      doctor: { include: { user: { select: { fullName: true } } } },
    },
  });
};

export const findMany = async (params: {
  skip?: number;
  take?: number;
  where?: Prisma.AppointmentWhereInput;
  orderBy?: Prisma.AppointmentOrderByWithRelationInput;
}): Promise<Appointment[]> => {
  return prisma.appointment.findMany({
    ...params,
    include: {
      patient: { select: { fullName: true } },
      doctor: { include: { user: { select: { fullName: true } } } },
    },
  });
};

export const count = async (where?: Prisma.AppointmentWhereInput): Promise<number> => {
  return prisma.appointment.count({ where });
};

export const update = async (id: string, data: Prisma.AppointmentUpdateInput): Promise<Appointment> => {
  return prisma.appointment.update({
    where: { id },
    data,
  });
};

export const findOverlap = async (doctorId: string, dateTime: Date): Promise<Appointment | null> => {
  // Check for overlap (assuming 30 mins duration for each slot)
  // An overlap exists if an existing appointment starts strictly between (newTime - 30 min) and (newTime + 30 min)
  const startTimeLimit = new Date(dateTime.getTime() - 30 * 60000);
  const endTimeLimit = new Date(dateTime.getTime() + 30 * 60000);

  return prisma.appointment.findFirst({
    where: {
      doctorId,
      status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.RESCHEDULED] },
      appointmentDateTime: {
        gt: startTimeLimit,
        lt: endTimeLimit,
      },
    },
  });
};

export const appointmentRepository = {
  create,
  findById,
  findMany,
  count,
  update,
  findOverlap,
};

export default appointmentRepository;
