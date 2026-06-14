import { Request, Response, NextFunction } from 'express';
import reportService from '../services/report.service';
import { sendSuccess } from '../utils/response';

export const getRevenueReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await reportService.getRevenueReport(req.query as any);
    return sendSuccess(res, data, 'Revenue report retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getAppointmentReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await reportService.getAppointmentReport(req.query as any);
    return sendSuccess(res, data, 'Appointment statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getPatientReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await reportService.getPatientReport(req.query as any);
    return sendSuccess(res, data, 'Patient statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const reportController = {
  getRevenueReport,
  getAppointmentReport,
  getPatientReport,
};

export default reportController;
