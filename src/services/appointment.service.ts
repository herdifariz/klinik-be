import appointmentRepository from '../repositories/appointment.repository';
import patientRepository from '../repositories/patient.repository';
import doctorRepository from '../repositories/doctor.repository';
import { CreateAppointmentInput, ListAppointmentsQuery, RescheduleAppointmentInput, CancelAppointmentInput } from '../schemas/appointment.schema';
import { Appointment, AppointmentStatus, Prisma } from '@prisma/client';

export const createAppointment = async (data: CreateAppointmentInput, userId: string, role: string): Promise<Appointment> => {
  let patientId = data.patientId;

  if (!patientId) {
    const error: any = new Error('Patient ID is required for staff-made appointments');
    error.statusCode = 400;
    throw error;
  }

  // Validate doctor exists
  const doctor = await doctorRepository.findById(data.doctorId);
  if (!doctor) {
    const error: any = new Error('Doctor not found');
    error.statusCode = 404;
    throw error;
  }

  // Check for availability/overlap
  const overlap = await appointmentRepository.findOverlap(data.doctorId, data.appointmentDateTime);
  if (overlap) {
    const error: any = new Error('Doctor is already booked for this time slot');
    error.statusCode = 409;
    throw error;
  }

  return appointmentRepository.create({
    appointmentDateTime: data.appointmentDateTime,
    reason: data.reason,
    notes: data.notes,
    patient: { connect: { id: patientId } },
    doctor: { connect: { id: data.doctorId } },
  });
};

export const listAppointments = async (query: ListAppointmentsQuery) => {
  const { page, limit, status, doctorId, patientId, startDate, endDate } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.AppointmentWhereInput = {};
  if (status) where.status = status;
  if (doctorId) where.doctorId = doctorId;
  if (patientId) where.patientId = patientId;
  if (startDate || endDate) {
    where.appointmentDateTime = {
      gte: startDate ? new Date(startDate) : undefined,
      lte: endDate ? new Date(endDate) : undefined,
    };
  }

  const [appointments, total] = await Promise.all([
    appointmentRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy: { appointmentDateTime: 'asc' },
    }),
    appointmentRepository.count(where),
  ]);

  return {
    appointments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getMyAppointments = async (userId: string, role: string) => {
  const where: Prisma.AppointmentWhereInput = {};

  if (role === 'DOCTOR') {
    const doctor = await doctorRepository.findByUserId(userId);
    if (!doctor) {
      const error: any = new Error('Doctor profile not found for this user');
      error.statusCode = 404;
      throw error;
    }
    where.doctorId = doctor.id;
  } else {
    // ADMIN and STAFF should use GET /appointments (listAppointments) to see all schedules.
    // This endpoint is specifically for doctors to view their own appointments.
    const error: any = new Error('This endpoint is only available for doctors. Use GET /appointments to list all appointments.');
    error.statusCode = 403;
    throw error;
  }

  return appointmentRepository.findMany({
    where,
    orderBy: { appointmentDateTime: 'asc' },
  });
};

export const rescheduleAppointment = async (id: string, data: RescheduleAppointmentInput, userId: string, role: string): Promise<Appointment> => {
  const appointment = await appointmentRepository.findById(id);
  if (!appointment) {
    const error: any = new Error('Appointment not found');
    error.statusCode = 404;
    throw error;
  }

  // Check overlap for new time
  const overlap = await appointmentRepository.findOverlap(appointment.doctorId, data.newAppointmentDateTime);
  if (overlap && overlap.id !== id) {
    const error: any = new Error('Doctor is already booked for the new time slot');
    error.statusCode = 409;
    throw error;
  }

  return appointmentRepository.update(id, {
    appointmentDateTime: data.newAppointmentDateTime,
    status: AppointmentStatus.RESCHEDULED,
    cancellationReason: data.reason, // Reusing field for context or just update date
  });
};

export const cancelAppointment = async (id: string, data: CancelAppointmentInput, userId: string, role: string): Promise<Appointment> => {
  const appointment = await appointmentRepository.findById(id);
  if (!appointment) {
    const error: any = new Error('Appointment not found');
    error.statusCode = 404;
    throw error;
  }

  return appointmentRepository.update(id, {
    status: AppointmentStatus.CANCELLED,
    cancelledAt: new Date(),
    cancelledBy: userId,
    cancellationReason: data.reason,
  });
};

export const appointmentService = {
  createAppointment,
  listAppointments,
  getMyAppointments,
  rescheduleAppointment,
  cancelAppointment,
};

export default appointmentService;
