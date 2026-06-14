import { Request, Response, NextFunction } from 'express';
import doctorService from '../services/doctor.service';
import { sendSuccess } from '../utils/response';

export const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    return sendSuccess(res, doctor, 'Doctor profile created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const listDoctors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { doctors, pagination } = await doctorService.listDoctors(req.query as any);
    
    // Format response to match API documentation and frontend expected structures
    const formattedDoctors = doctors.map(d => ({
      id: d.id,
      userId: d.userId,
      specialty: d.specialization, // mapped to match frontend doc.specialty
      fullName: (d as any).user.fullName,
      specialization: d.specialization,
      experience: d.experience,
      consultationFee: d.consultationFee,
      rating: d.rating,
      totalRatings: d.totalRatings,
      isAvailable: d.isAvailable,
      workingHoursStart: d.workingHoursStart,
      workingHoursEnd: d.workingHoursEnd,
      user: {
        name: (d as any).user.fullName,
        email: (d as any).user.email || '',
      }
    }));

    return sendSuccess(res, formattedDoctors, 'Doctors retrieved successfully', 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const getDoctorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    
    const formattedDoctor = {
      id: doctor.id,
      fullName: (doctor as any).user.fullName,
      specialization: doctor.specialization,
      experience: doctor.experience,
      biography: doctor.biography,
      consultationFee: doctor.consultationFee,
      rating: doctor.rating,
      isAvailable: doctor.isAvailable,
      workingDaysStart: doctor.workingDaysStart,
      workingDaysEnd: doctor.workingDaysEnd,
      workingHoursStart: doctor.workingHoursStart,
      workingHoursEnd: doctor.workingHoursEnd,
      // schedules can be added here if implemented
    };

    return sendSuccess(res, formattedDoctor, 'Doctor detail retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const requester = req.user!;

    // Authorization: Only Admin or the Doctor themselves can update
    const doctor = await doctorService.getDoctorById(id);
    
    // Only ADMIN can update any doctor, or DOCTOR can update their own profile
    if (requester.role === 'ADMIN') {
      // Admin can update any doctor profile
    } else if (requester.role === 'DOCTOR' && requester.id === doctor.userId) {
      // Doctor can update their own profile
    } else {
      const error: any = new Error('Forbidden - You can only update your own profile');
      error.statusCode = 403;
      throw error;
    }

    const updatedDoctor = await doctorService.updateDoctor(id, req.body);
    return sendSuccess(res, updatedDoctor, 'Doctor profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { date } = req.query as { date: string };
    const result = await doctorService.getAvailableSlots(id, date);
    return sendSuccess(res, result, 'Available slots retrieved');
  } catch (error) {
    next(error);
  }
};

export const doctorController = {
  createDoctor,
  listDoctors,
  getDoctorById,
  updateDoctor,
  getAvailableSlots,
};

export default doctorController;
