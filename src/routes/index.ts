import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import patientRoutes from './patient.routes';
import doctorRoutes from './doctor.routes';
import appointmentRoutes from './appointment.routes';
import prescriptionRoutes from './prescription.routes';
import medicineRoutes from './medicine.routes';
import paymentRoutes from './payment.routes';
import medicalRecordRoutes from './medical-record.routes';
import reportRoutes from './report.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/medicines', medicineRoutes);
router.use('/payments', paymentRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/reports', reportRoutes);

router.get('/', (req, res) => {
  res.json({ message: 'Klinik API v1' });
});

export default router;
