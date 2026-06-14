import doctorRepository from '../repositories/doctor.repository';
import userRepository from '../repositories/user.repository';
import { ListDoctorsQuery, CreateDoctorInput, UpdateDoctorInput } from '../schemas/doctor.schema';
import { Doctor, Prisma } from '@prisma/client';

export const createDoctor = async (data: CreateDoctorInput): Promise<Doctor> => {
  const user = await userRepository.findById(data.userId);
  if (!user) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const existingDoctor = await doctorRepository.findByUserId(data.userId);
  if (existingDoctor) {
    const error: any = new Error('Doctor profile already exists for this user');
    error.statusCode = 409;
    throw error;
  }

  return doctorRepository.create({
    ...data,
    user: { connect: { id: data.userId } },
  } as any);
};

export const listDoctors = async (query: ListDoctorsQuery) => {
  const { page, limit, specialization, isAvailable, search, sortBy, order } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.DoctorWhereInput = {};
  if (specialization) where.specialization = { contains: specialization, mode: 'insensitive' };
  if (isAvailable !== undefined) where.isAvailable = isAvailable;
  if (search) {
    where.OR = [
      { specialization: { contains: search, mode: 'insensitive' } },
      { user: { fullName: { contains: search, mode: 'insensitive' } } },
    ];
  }

  const [doctors, total] = await Promise.all([
    doctorRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy: { [sortBy]: order },
    }),
    doctorRepository.count(where),
  ]);

  return {
    doctors,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getDoctorById = async (id: string): Promise<Doctor> => {
  const doctor = await doctorRepository.findById(id);
  if (!doctor) {
    const error: any = new Error('Doctor not found');
    error.statusCode = 404;
    throw error;
  }
  return doctor;
};

export const updateDoctor = async (id: string, data: UpdateDoctorInput): Promise<Doctor> => {
  const doctor = await doctorRepository.findById(id);
  if (!doctor) {
    const error: any = new Error('Doctor not found');
    error.statusCode = 404;
    throw error;
  }

  return doctorRepository.update(id, data);
};

export const getAvailableSlots = async (id: string, date: string) => {
  const doctor = await doctorRepository.findById(id);
  if (!doctor) {
    const error: any = new Error('Doctor not found');
    error.statusCode = 404;
    throw error;
  }

  // Basic slot generation logic (static for now, based on doctor's working hours)
  // In a real app, this should check against existing appointments
  const start = doctor.workingHoursStart || '08:00';
  const end = doctor.workingHoursEnd || '17:00';
  const slotDuration = 30; // minutes

  const slots = [];
  let current = new Date(`${date}T${start}:00`);
  const endTime = new Date(`${date}T${end}:00`);

  while (current < endTime) {
    const timeString = current.toTimeString().slice(0, 5);
    
    // Skip break time if defined
    let isBreak = false;
    if (doctor.breakTimeStart && doctor.breakTimeEnd) {
      const breakStart = new Date(`${date}T${doctor.breakTimeStart}:00`);
      const breakEnd = new Date(`${date}T${doctor.breakTimeEnd}:00`);
      if (current >= breakStart && current < breakEnd) {
        isBreak = true;
      }
    }

    if (!isBreak) {
      slots.push(timeString);
    }
    
    current = new Date(current.getTime() + slotDuration * 60000);
  }

  return {
    doctorId: id,
    date,
    slots,
  };
};

export const doctorService = {
  createDoctor,
  listDoctors,
  getDoctorById,
  updateDoctor,
  getAvailableSlots,
};

export default doctorService;
