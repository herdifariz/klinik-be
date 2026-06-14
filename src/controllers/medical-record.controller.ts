import { Request, Response, NextFunction } from 'express';
import medicalRecordService from '../services/medical-record.service';
import { sendSuccess } from '../utils/response';

export const createMedicalRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctorUserId = req.user!.id;
    const record = await medicalRecordService.createMedicalRecord(req.body, doctorUserId);
    return sendSuccess(res, record, 'Medical record created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getMedicalRecordById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await medicalRecordService.getMedicalRecordById(req.params.id);
    
    // Formatting response to match documentation
    const formattedData = {
      id: record.id,
      appointmentId: record.appointmentId,
      patientId: record.patientId,
      patientName: (record as any).patient.fullName,
      doctorName: (record as any).doctor?.fullName,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      medications: record.medications,
      investigations: record.investigations,
      followUpRequired: record.followUpRequired,
      followUpDate: record.followUpDate,
      notes: record.notes,
      documentUrl: record.documentUrl,
      createdAt: record.createdAt
    };

    return sendSuccess(res, formattedData, 'Medical record retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const listMedicalRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { records, pagination } = await medicalRecordService.listMedicalRecords(req.query as any);
    
    const formattedData = records.map(r => ({
      id: r.id,
      patientName: (r as any).patient.fullName,
      doctorName: (r as any).doctor?.fullName,
      diagnosis: r.diagnosis,
      createdAt: r.createdAt,
      appointmentDate: (r as any).appointment.appointmentDateTime
    }));

    return sendSuccess(res, formattedData, 'Medical records retrieved successfully', 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const updateMedicalRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await medicalRecordService.updateMedicalRecord(req.params.id, req.body);
    return sendSuccess(res, record, 'Medical record updated successfully');
  } catch (error) {
    next(error);
  }
};

export const medicalRecordController = {
  createMedicalRecord,
  getMedicalRecordById,
  listMedicalRecords,
  updateMedicalRecord,
};

export default medicalRecordController;
