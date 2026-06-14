import { Request, Response, NextFunction } from 'express';
import prescriptionService from '../services/prescription.service';
import { sendSuccess } from '../utils/response';

export const createPrescription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorUserId = req.user!.id;
    const prescription = await prescriptionService.createPrescription(req.body, doctorUserId);
    
    // Formatting response according to API documentation
    const formattedData = {
      id: prescription.id,
      appointmentId: prescription.appointmentId,
      prescriptionDate: prescription.prescriptionDate,
      validityEndDate: prescription.validityEndDate,
      items: (prescription as any).items.map((item: any) => ({
        id: item.id,
        medicineName: item.medicine.name,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity,
        instructions: item.instructions
      }))
    };

    return sendSuccess(res, formattedData, 'Prescription created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prescription = await prescriptionService.getPrescriptionById(req.params.id);
    
    const formattedData = {
      id: prescription.id,
      patientName: (prescription as any).patient.fullName,
      doctorName: (prescription as any).doctor.user.fullName,
      prescriptionDate: prescription.prescriptionDate,
      validityEndDate: prescription.validityEndDate,
      items: (prescription as any).items.map((item: any) => ({
        id: item.id,
        medicineName: item.medicine.name,
        genericName: item.medicine.genericName,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity,
        unitPrice: item.medicine.unitPrice,
        instructions: item.instructions,
        sideEffects: item.medicine.sideEffects
      })),
      notes: prescription.notes,
      status: prescription.status
    };

    return sendSuccess(res, formattedData, 'Prescription detail retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const listPrescriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prescriptions, pagination } = await prescriptionService.listPrescriptions(req.query as any);
    
    const formattedData = prescriptions.map(p => ({
      id: p.id,
      patientName: (p as any).patient.fullName,
      doctorName: (p as any).doctor.user.fullName,
      prescriptionDate: p.prescriptionDate,
      itemCount: (p as any)._count.items,
      status: p.status
    }));

    return sendSuccess(res, formattedData, 'Prescriptions retrieved successfully', 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const prescriptionController = {
  createPrescription,
  getPrescriptionById,
  listPrescriptions,
};

export default prescriptionController;
