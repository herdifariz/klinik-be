import { Request, Response, NextFunction } from 'express';
import appointmentService from '../services/appointment.service';
import { sendSuccess } from '../utils/response';

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const appointment = await appointmentService.createAppointment(req.body, user.id, user.role);
    
    // Format response to match API documentation
    const formattedData = {
      id: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentDateTime: appointment.appointmentDateTime,
      status: appointment.status,
      reason: appointment.reason,
      notes: appointment.notes,
      createdAt: appointment.createdAt
    };

    return sendSuccess(res, formattedData, 'Appointment booked successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const listAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { appointments, pagination } = await appointmentService.listAppointments(req.query as any);
    
    const formattedData = appointments.map(a => ({
      id: a.id,
      patientName: (a as any).patient.fullName,
      doctorName: (a as any).doctor.user.fullName,
      appointmentDateTime: a.appointmentDateTime,
      status: a.status,
      reason: a.reason,
      consultationFee: (a as any).doctor.consultationFee
    }));

    return sendSuccess(res, formattedData, 'Appointments retrieved successfully', 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const appointments = await appointmentService.getMyAppointments(user.id, user.role);
    
    const formattedData = appointments.map(a => ({
      id: a.id,
      patientName: (a as any).patient.fullName,
      doctorName: (a as any).doctor.user.fullName,
      appointmentDateTime: a.appointmentDateTime,
      status: a.status,
      reason: a.reason
    }));

    return sendSuccess(res, formattedData, 'My appointments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const rescheduleAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const appointment = await appointmentService.rescheduleAppointment(req.params.id, req.body, user.id, user.role);
    
    return sendSuccess(res, {
      id: appointment.id,
      appointmentDateTime: appointment.appointmentDateTime,
      status: appointment.status,
      updatedAt: appointment.updatedAt
    }, 'Appointment rescheduled successfully');
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const appointment = await appointmentService.cancelAppointment(req.params.id, req.body, user.id, user.role);
    
    return sendSuccess(res, {
      id: appointment.id,
      status: appointment.status,
      cancelledAt: appointment.cancelledAt
    }, 'Appointment cancelled successfully');
  } catch (error) {
    next(error);
  }
};

export const appointmentController = {
  createAppointment,
  listAppointments,
  getMyAppointments,
  rescheduleAppointment,
  cancelAppointment,
};

export default appointmentController;
