import { Request, Response, NextFunction } from 'express';
import patientService from '../services/patient.service';
import { sendSuccess } from '../utils/response';

export const createPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patient = await patientService.createPatient(req.body);
    return sendSuccess(res, patient, 'Patient created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const listPatients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patients, pagination } = await patientService.listPatients(req.query as any);
    return sendSuccess(res, patients, 'Patients retrieved successfully', 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const getPatientById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    return sendSuccess(res, patient, 'Patient retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedPatient = await patientService.updatePatient(id, req.body);
    return sendSuccess(res, updatedPatient, 'Patient updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await patientService.deletePatient(req.params.id);
    return sendSuccess(res, null, 'Patient profile deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const patientController = {
  createPatient,
  listPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};

export default patientController;
