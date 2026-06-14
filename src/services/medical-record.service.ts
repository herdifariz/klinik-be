import medicalRecordRepository from '../repositories/medical-record.repository';
import appointmentRepository from '../repositories/appointment.repository';
import { CreateMedicalRecordInput, ListMedicalRecordsQuery, UpdateMedicalRecordInput } from '../schemas/medical-record.schema';
import { MedicalRecord, Prisma } from '@prisma/client';

export const createMedicalRecord = async (
  data: CreateMedicalRecordInput,
  // Note: doctorUserId is the User.id of the authenticated doctor.
  // MedicalRecord.doctorId relates to the User model (not the Doctor model),
  // which differs from Prescription.doctorId that relates to the Doctor model.
  doctorUserId: string
): Promise<MedicalRecord> => {
  const appointment = await appointmentRepository.findById(data.appointmentId);
  if (!appointment) {
    const error: any = new Error('Appointment not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if medical record already exists for this appointment
  const existingRecord = await medicalRecordRepository.findMany({
    where: { appointmentId: data.appointmentId }
  });
  if (existingRecord.length > 0) {
    const error: any = new Error('Medical record already exists for this appointment');
    error.statusCode = 409;
    throw error;
  }

  return medicalRecordRepository.create({
    diagnosis: data.diagnosis,
    treatment: data.treatment,
    medications: data.medications,
    investigations: data.investigations,
    followUpRequired: data.followUpRequired,
    followUpDate: data.followUpDate,
    notes: data.notes,
    documentUrl: data.documentUrl,
    appointment: { connect: { id: data.appointmentId } },
    patient: { connect: { id: data.patientId } },
    // doctorId here stores the User.id of the doctor (not Doctor.id)
    // This is consistent with the schema: MedicalRecord -> User (via doctorId)
    doctor: { connect: { id: doctorUserId } },
  });
};

export const getMedicalRecordById = async (id: string): Promise<MedicalRecord> => {
  const record = await medicalRecordRepository.findById(id);
  if (!record) {
    const error: any = new Error('Medical record not found');
    error.statusCode = 404;
    throw error;
  }
  return record;
};

export const listMedicalRecords = async (query: ListMedicalRecordsQuery) => {
  const { page, limit, patientId, doctorId, startDate, endDate } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.MedicalRecordWhereInput = {};
  if (patientId) where.patientId = patientId;
  if (doctorId) where.doctorId = doctorId;
  if (startDate || endDate) {
    where.createdAt = {
      gte: startDate ? new Date(startDate) : undefined,
      lte: endDate ? new Date(endDate) : undefined,
    };
  }

  const [records, total] = await Promise.all([
    medicalRecordRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: 'desc' },
    }),
    medicalRecordRepository.count(where),
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const updateMedicalRecord = async (id: string, data: UpdateMedicalRecordInput): Promise<MedicalRecord> => {
  const record = await medicalRecordRepository.findById(id);
  if (!record) {
    const error: any = new Error('Medical record not found');
    error.statusCode = 404;
    throw error;
  }

  return medicalRecordRepository.update(id, data);
};

export const medicalRecordService = {
  createMedicalRecord,
  getMedicalRecordById,
  listMedicalRecords,
  updateMedicalRecord,
};

export default medicalRecordService;
