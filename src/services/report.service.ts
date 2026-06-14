import prisma from '../config/database';
import { ReportQueryInput } from '../schemas/report.schema';
import { PaymentStatus, AppointmentStatus } from '@prisma/client';

export const getRevenueReport = async (query: ReportQueryInput) => {
  const { startDate, endDate } = query;
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const payments = await prisma.payment.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  const summary = {
    totalRevenue: payments.reduce((sum, p) => sum + (p.status === PaymentStatus.PAID ? p.paidAmount : 0), 0),
    totalPayments: payments.length,
    averagePayment: payments.length > 0 ? payments.reduce((sum, p) => sum + p.totalAmount, 0) / payments.length : 0,
    paidPayments: payments.filter(p => p.status === PaymentStatus.PAID).length,
    pendingPayments: payments.filter(p => p.status === PaymentStatus.PENDING).length,
  };

  const byPaymentMethod: Record<string, number> = {};
  payments.forEach(p => {
    if (p.status === PaymentStatus.PAID) {
      const method = p.paymentMethod.toLowerCase();
      byPaymentMethod[method] = (byPaymentMethod[method] || 0) + p.paidAmount;
    }
  });

  // Daily breakdown
  const dailyMap: Record<string, { revenue: number, paymentCount: number }> = {};
  payments.forEach(p => {
    const dateStr = p.createdAt.toISOString().split('T')[0];
    if (!dailyMap[dateStr]) dailyMap[dateStr] = { revenue: 0, paymentCount: 0 };
    if (p.status === PaymentStatus.PAID) {
      dailyMap[dateStr].revenue += p.paidAmount;
    }
    dailyMap[dateStr].paymentCount += 1;
  });

  const dailyBreakdown = Object.entries(dailyMap).map(([date, data]) => ({
    date,
    ...data,
  })).sort((a, b) => a.date.localeCompare(b.date));

  return {
    period: { startDate, endDate },
    summary,
    byPaymentMethod,
    dailyBreakdown,
  };
};

export const getAppointmentReport = async (query: ReportQueryInput) => {
  const { startDate, endDate } = query;
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentDateTime: {
        gte: start,
        lte: end,
      },
    },
    include: {
      doctor: {
        include: {
          user: { select: { fullName: true } }
        }
      }
    }
  });

  const summary = {
    totalAppointments: appointments.length,
    completed: appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length,
    cancelled: appointments.filter(a => a.status === AppointmentStatus.CANCELLED).length,
    rescheduled: appointments.filter(a => a.status === AppointmentStatus.RESCHEDULED).length,
    scheduled: appointments.filter(a => a.status === AppointmentStatus.SCHEDULED).length,
  };

  const doctorMap: Record<string, any> = {};
  appointments.forEach(a => {
    const dId = a.doctorId;
    if (!doctorMap[dId]) {
      doctorMap[dId] = {
        doctorId: dId,
        doctorName: (a.doctor as any).user.fullName,
        specialization: a.doctor.specialization,
        totalAppointments: 0,
        completed: 0,
        cancelled: 0,
      };
    }
    doctorMap[dId].totalAppointments += 1;
    if (a.status === AppointmentStatus.COMPLETED) doctorMap[dId].completed += 1;
    if (a.status === AppointmentStatus.CANCELLED) doctorMap[dId].cancelled += 1;
  });

  return {
    period: { startDate, endDate },
    summary,
    byDoctor: Object.values(doctorMap),
  };
};

export const getPatientReport = async (query: ReportQueryInput) => {
  const { startDate, endDate } = query;
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const [totalPatients, newPatients, activePatientsData] = await Promise.all([
    prisma.patient.count(),
    prisma.patient.count({
      where: {
        createdAt: { gte: start, lte: end }
      }
    }),
    prisma.appointment.groupBy({
      by: ['patientId'],
      where: {
        appointmentDateTime: { gte: start, lte: end }
      },
      _count: { patientId: true }
    })
  ]);

  const appointmentsData = await prisma.appointment.count({
    where: { appointmentDateTime: { gte: start, lte: end } }
  });

  const summary = {
    totalPatients,
    newPatients,
    activePatients: activePatientsData.length,
    avgAppointmentsPerPatient: activePatientsData.length > 0 ? appointmentsData / activePatientsData.length : 0,
  };

  // Age calculation (rough)
  const allPatients = await prisma.patient.findMany({ select: { dateOfBirth: true } });
  const ageGroups: Record<string, number> = {
    '0-18': 0,
    '19-30': 0,
    '31-45': 0,
    '46-60': 0,
    '60+': 0
  };

  const now = new Date();
  allPatients.forEach(p => {
    const age = now.getFullYear() - p.dateOfBirth.getFullYear();
    if (age <= 18) ageGroups['0-18']++;
    else if (age <= 30) ageGroups['19-30']++;
    else if (age <= 45) ageGroups['31-45']++;
    else if (age <= 60) ageGroups['46-60']++;
    else ageGroups['60+']++;
  });

  const byAge = Object.entries(ageGroups).map(([ageRange, count]) => ({
    ageRange,
    count
  }));

  return {
    period: { startDate, endDate },
    summary,
    byAge
  };
};

export const reportService = {
  getRevenueReport,
  getAppointmentReport,
  getPatientReport,
};

export default reportService;
