import prescriptionRepository from "../repositories/prescription.repository";
import doctorRepository from "../repositories/doctor.repository";
import {
  CreatePrescriptionInput,
  ListPrescriptionsQuery,
} from "../schemas/prescription.schema";
import { Prescription, Prisma } from "@prisma/client";
import prisma from "../config/database";

export const createPrescription = async (
  data: CreatePrescriptionInput,
  doctorUserId: string,
): Promise<Prescription> => {
  const doctor = await doctorRepository.findByUserId(doctorUserId);
  if (!doctor) {
    const error: any = new Error("Doctor profile not found");
    error.statusCode = 404;
    throw error;
  }

  const validityEndDate = new Date();
  validityEndDate.setDate(
    validityEndDate.getDate() + (data.validityDays || 30),
  );

  return prisma.$transaction(async (tx) => {
    // 1. Check and deduct stock for each medicine
    for (const item of data.items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId },
      });
      if (!medicine) {
        const error: any = new Error(`Medicine not found: ${item.medicineId}`);
        error.statusCode = 404;
        throw error;
      }
      if (medicine.stock < item.quantity) {
        const error: any = new Error(
          `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}, Requested: ${item.quantity}`,
        );
        error.statusCode = 400;
        throw error;
      }

      // Deduct stock
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // 2. Create the prescription
    return tx.prescription.create({
      data: {
        appointment: { connect: { id: data.appointmentId } },
        patient: { connect: { id: data.patientId } },
        doctor: { connect: { id: doctor.id } },
        validityEndDate,
        notes: data.notes,
        items: {
          create: data.items.map((item) => ({
            medicine: { connect: { id: item.medicineId } },
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            quantity: item.quantity,
            instructions: item.instructions,
          })),
        },
      },
      include: {
        items: {
          include: { medicine: true },
        },
      },
    });
  });
};

export const getPrescriptionById = async (
  id: string,
): Promise<Prescription> => {
  const prescription = await prescriptionRepository.findById(id);
  if (!prescription) {
    const error: any = new Error("Prescription not found");
    error.statusCode = 404;
    throw error;
  }
  return prescription;
};

export const listPrescriptions = async (query: ListPrescriptionsQuery) => {
  const { page, limit, patientId, doctorId, status } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.PrescriptionWhereInput = {};
  if (patientId) where.patientId = patientId;
  if (doctorId) where.doctorId = doctorId;
  if (status) where.status = status;

  const [prescriptions, total] = await Promise.all([
    prescriptionRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: "desc" },
    }),
    prescriptionRepository.count(where),
  ]);

  return {
    prescriptions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const prescriptionService = {
  createPrescription,
  getPrescriptionById,
  listPrescriptions,
};

export default prescriptionService;
