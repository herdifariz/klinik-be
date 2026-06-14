import { UserRole, Gender, BloodType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/database';
import 'dotenv/config';

async function main() {
  console.log('Start seeding...');

  // 1. Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@klinik.com' },
    update: {},
    create: {
      email: 'admin@klinik.com',
      password: adminPassword,
      fullName: 'Super Administrator',
      role: UserRole.ADMIN,
    },
  });
  console.log(`Created admin: ${admin.email}`);

  // 2. Create Staff
  const staffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@klinik.com' },
    update: {},
    create: {
      email: 'staff@klinik.com',
      password: staffPassword,
      fullName: 'Front Desk Staff',
      role: UserRole.STAFF,
    },
  });
  console.log(`Created staff: ${staff.email}`);

  // 3. Create Doctor
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  const doctorUser = await prisma.user.upsert({
    where: { email: 'dr.budi@klinik.com' },
    update: {},
    create: {
      email: 'dr.budi@klinik.com',
      password: doctorPassword,
      fullName: 'Dr. Budi Santoso',
      role: UserRole.DOCTOR,
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      licenseNumber: 'DOC-123456789',
      specialization: 'Umum',
      experience: 10,
      biography: 'Dokter Umum dengan pengalaman 10 tahun.',
      consultationFee: 150000,
      workingDaysStart: 'Monday',
      workingDaysEnd: 'Friday',
      workingHoursStart: '08:00',
      workingHoursEnd: '16:00',
    },
  });
  console.log(`Created doctor: ${doctorUser.fullName}`);

  // // 4. Create Patient
  // const patientPassword = await bcrypt.hash('patient123', 10);
  // const patientUser = await prisma.user.upsert({
  //   where: { email: 'andi@patient.com' },
  //   update: {},
  //   create: {
  //     email: 'andi@patient.com',
  //     password: patientPassword,
  //     fullName: 'Andi Setiawan',
  //     role: UserRole.PATIENT,
  //   },
  // });

  // const patient = await prisma.patient.upsert({
  //   where: { userId: patientUser.id },
  //   update: {},
  //   create: {
  //     userId: patientUser.id,
  //     medicalId: 'MED-20240101-0001',
  //     nik: '3273012345678901',
  //     dateOfBirth: new Date('1990-05-15'),
  //     gender: Gender.MALE,
  //     phone: '+6281234567890',
  //     address: 'Jl. Merdeka No. 123',
  //     city: 'Jakarta',
  //     province: 'DKI Jakarta',
  //     emergencyContactName: 'Budi Setiawan',
  //     emergencyContactPhone: '+6281234567891',
  //     bloodType: BloodType.O_POSITIVE,
  //   },
  // });
  // console.log(`Created patient: ${patientUser.fullName}`);

  // 5. Create Medicines
  const medicines = [
    {
      code: 'MED-001',
      name: 'Paracetamol 500mg',
      category: 'Analgesik',
      dosage: '500mg',
      form: 'Tablet',
      manufacturer: 'PharmaTech',
      stock: 100,
      unitPrice: 5000,
    },
    {
      code: 'MED-002',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotik',
      dosage: '250mg',
      form: 'Kapsul',
      manufacturer: 'BioPharma',
      stock: 50,
      unitPrice: 10000,
    },
    {
      code: 'MED-003',
      name: 'Ibuprofen 400mg',
      category: 'Anti-inflamasi',
      dosage: '400mg',
      form: 'Tablet',
      manufacturer: 'HealthMed',
      stock: 75,
      unitPrice: 7500,
    },
  ];

  for (const med of medicines) {
    await prisma.medicine.upsert({
      where: { code: med.code },
      update: {},
      create: med,
    });
  }
  console.log('Created medicines');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
