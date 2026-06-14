import { Request, Response, NextFunction } from 'express';
import medicineService from '../services/medicine.service';
import { sendSuccess } from '../utils/response';

export const createMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const medicine = await medicineService.createMedicine(req.body);
    return sendSuccess(res, medicine, 'Medicine created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const listMedicines = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { medicines, pagination } = await medicineService.listMedicines(req.query as any);
    return sendSuccess(res, medicines, 'Medicines retrieved successfully', 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const getMedicineById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const medicine = await medicineService.getMedicineById(req.params.id);
    return sendSuccess(res, medicine, 'Medicine retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateMedicine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const medicine = await medicineService.updateMedicine(req.params.id, req.body);
    return sendSuccess(res, medicine, 'Medicine updated successfully');
  } catch (error) {
    next(error);
  }
};

export const medicineController = {
  createMedicine,
  listMedicines,
  getMedicineById,
  updateMedicine,
};

export default medicineController;
