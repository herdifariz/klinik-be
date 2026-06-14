import patientRepository from '../repositories/patient.repository';
import userRepository from '../repositories/user.repository';
import { CreatePatientInput, UpdatePatientInput, ListPatientsQuery } from '../schemas/patient.schema';
import { Patient, Prisma } from '@prisma/client';

const generateMedicalId = async (): Promise<string> => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = await patientRepository.count();
  const sequence = (count + 1).toString().padStart(4, '0');
  return `MED-${date}-${sequence}`;
};

export const createPatient = async (data: CreatePatientInput): Promise<Patient> => {
  const medicalId = await generateMedicalId();

  return patientRepository.create({
    ...data,
    medicalId,
  } as any); 
};

export const listPatients = async (query: ListPatientsQuery) => {
  const { page, limit, search, city, sortBy, order } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.PatientWhereInput = {};
  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (search) {
    where.OR = [
      { medicalId: { contains: search, mode: 'insensitive' } },
      { nik: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [patients, total] = await Promise.all([
    patientRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy: { [sortBy]: order },
    }),
    patientRepository.count(where),
  ]);

  return {
    patients,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getPatientById = async (id: string): Promise<Patient> => {
  const patient = await patientRepository.findById(id);
  if (!patient) {
    const error: any = new Error('Patient not found');
    error.statusCode = 404;
    throw error;
  }
  return patient;
};

export const updatePatient = async (id: string, data: UpdatePatientInput): Promise<Patient> => {
  const patient = await patientRepository.findById(id);
  if (!patient) {
    const error: any = new Error('Patient not found');
    error.statusCode = 404;
    throw error;
  }

  return patientRepository.update(id, data);
};

export const deletePatient = async (id: string): Promise<Patient> => {
  const patient = await patientRepository.findById(id);
  if (!patient) {
    const error: any = new Error('Patient not found');
    error.statusCode = 404;
    throw error;
  }

  return patientRepository.remove(id);
};

export const patientService = {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};

export default patientService;
