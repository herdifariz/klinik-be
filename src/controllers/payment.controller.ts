import { Request, Response, NextFunction } from 'express';
import paymentService from '../services/payment.service';
import { sendSuccess } from '../utils/response';

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    return sendSuccess(res, payment, 'Payment created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    
    // Formatting response to match documentation
    const formattedData = {
      id: payment.id,
      appointmentId: payment.appointmentId,
      patientName: (payment as any).patient.fullName,
      doctorName: (payment as any).appointment.doctor.user.fullName,
      amount: payment.amount,
      totalAmount: payment.totalAmount,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      paidAt: payment.paidAt,
      transactionId: payment.transactionId,
      referenceNumber: payment.referenceNumber
    };

    return sendSuccess(res, formattedData, 'Payment detail retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const listPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { payments, pagination } = await paymentService.listPayments(req.query as any);
    
    const formattedData = payments.map(p => ({
      id: p.id,
      appointmentId: p.appointmentId,
      patientName: (p as any).patient.fullName,
      amount: p.amount,
      status: p.status,
      paymentMethod: p.paymentMethod,
      paidAt: p.paidAt
    }));

    return sendSuccess(res, formattedData, 'Payments retrieved successfully', 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payment = await paymentService.confirmPayment(req.params.id, req.body);
    return sendSuccess(res, {
      id: payment.id,
      status: payment.status,
      paidAt: payment.paidAt
    }, 'Payment confirmed successfully');
  } catch (error) {
    next(error);
  }
};

export const paymentController = {
  createPayment,
  getPaymentById,
  listPayments,
  confirmPayment,
};

export default paymentController;
