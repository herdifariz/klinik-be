import paymentRepository from '../repositories/payment.repository';
import appointmentRepository from '../repositories/appointment.repository';
import { CreatePaymentInput, ConfirmPaymentInput, ListPaymentsQuery } from '../schemas/payment.schema';
import { Payment, PaymentStatus, Prisma } from '@prisma/client';

export const createPayment = async (data: CreatePaymentInput): Promise<Payment> => {
  const appointment = await appointmentRepository.findById(data.appointmentId);
  if (!appointment) {
    const error: any = new Error('Appointment not found');
    error.statusCode = 404;
    throw error;
  }

  // Validate that appointment doesn't already have a payment (unique constraint)
  const existingPayment = await paymentRepository.findMany({
    where: { appointmentId: data.appointmentId },
    take: 1,
  });
  if (existingPayment.length > 0) {
    const error: any = new Error('Payment already exists for this appointment');
    error.statusCode = 409;
    throw error;
  }

  const totalAmount = data.amount - (data.discountAmount || 0) + (data.taxAmount || 0);

  return paymentRepository.create({
    amount: data.amount,
    discountAmount: data.discountAmount,
    discountReason: data.discountReason,
    taxAmount: data.taxAmount,
    totalAmount,
    paymentMethod: data.paymentMethod,
    notes: data.notes,
    appointment: { connect: { id: data.appointmentId } },
    patient: { connect: { id: data.patientId } },
  });
};

export const getPaymentById = async (id: string): Promise<Payment> => {
  const payment = await paymentRepository.findById(id);
  if (!payment) {
    const error: any = new Error('Payment not found');
    error.statusCode = 404;
    throw error;
  }
  return payment;
};

export const listPayments = async (query: ListPaymentsQuery) => {
  const { page, limit, status, patientId, appointmentId, startDate, endDate } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.PaymentWhereInput = {};
  if (status) where.status = status;
  if (patientId) where.patientId = patientId;
  if (appointmentId) where.appointmentId = appointmentId;
  if (startDate || endDate) {
    where.createdAt = {
      gte: startDate ? new Date(startDate) : undefined,
      lte: endDate ? new Date(endDate) : undefined,
    };
  }

  const [payments, total] = await Promise.all([
    paymentRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: 'desc' },
    }),
    paymentRepository.count(where),
  ]);

  return {
    payments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const confirmPayment = async (id: string, data: ConfirmPaymentInput): Promise<Payment> => {
  const payment = await paymentRepository.findById(id);
  if (!payment) {
    const error: any = new Error('Payment not found');
    error.statusCode = 404;
    throw error;
  }

  return paymentRepository.update(id, {
    status: PaymentStatus.PAID,
    transactionId: data.transactionId,
    referenceNumber: data.referenceNumber,
    paidAmount: data.paidAmount || payment.totalAmount,
    paidAt: new Date(),
    notes: data.notes ? `${payment.notes || ''}\n${data.notes}` : payment.notes,
  });
};

export const paymentService = {
  createPayment,
  getPaymentById,
  listPayments,
  confirmPayment,
};

export default paymentService;
