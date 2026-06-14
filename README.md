# Sistem Informasi Manajemen Klinik - Backend (BE)

Repositori ini berisi backend API untuk **Sistem Informasi Manajemen Klinik (SIMK)** yang dibangun menggunakan Node.js, Express, dan Prisma ORM dengan basis data PostgreSQL.

## 🚀 Fitur Utama
- **RESTful API**: Endpoint lengkap untuk manajemen pasien, dokter, janji temu, resep obat, pembayaran, dan dashboard.
- **Autentikasi & Otorisasi**: Sistem login menggunakan JWT dan Role-Based Access Control (RBAC) untuk Admin, Dokter, dan Pasien.
- **Validasi Data**: Validasi input yang aman menggunakan Zod schema.
- **ORM & Migrasi**: Integrasi database PostgreSQL yang andal melalui Prisma ORM.

## 🛠️ Tech Stack
- **Runtime & Language**: Node.js & TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (dikoneksikan via Prisma ORM)
- **Security**: JWT (jsonwebtoken), bcryptjs (hashing password), Helmet & CORS
- **Logging**: Winston & Morgan
- **Validation**: Zod
- **Testing**: Jest & Supertest

## 📦 Cara Memulai

### 1. Prasyarat
- Node.js (versi 18+)
- Database PostgreSQL yang aktif

### 2. Instalasi Dependensi
Jalankan perintah berikut di dalam direktori `be`:
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env` di direktori `be` dan isi dengan konfigurasi berikut:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/klinik_db?schema=public"
PORT=5000
JWT_SECRET="rahasia_super_aman_anda"
```

### 4. Sinkronisasi Database (Prisma)
Jalankan migrasi database dan seed data awal:
```bash
# Menjalankan migrasi database
npm run prisma:migrate

# Membuat data awal (seeding)
npm run prisma:seed
```

### 5. Menjalankan Server Pengembangan
Jalankan perintah berikut untuk memulai server backend:
```bash
npm run dev
```
Server backend akan berjalan di [http://localhost:5000](http://localhost:5000).

## 📜 Skrip yang Tersedia
- `npm run dev` - Menjalankan server menggunakan Nodemon (auto-reload).
- `npm run build` - Mengompilasi TypeScript menjadi JavaScript di folder `dist`.
- `npm run start` - Menjalankan aplikasi hasil kompilasi.
- `npm run test` - Menjalankan pengujian otomatis menggunakan Jest.
- `npm run prisma:generate` - Menghasilkan Prisma Client terbaru.
- `npm run prisma:migrate` - Menjalankan migrasi skema database.
- `npm run prisma:seed` - Mengisi database dengan data awal.
