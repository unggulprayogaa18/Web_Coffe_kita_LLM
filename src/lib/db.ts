// src/lib/db.ts
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Mengambil URL dari file .env
const connectionString = process.env.DATABASE_URL;

// Konfigurasi Pool dan Adapter untuk Prisma 7
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Fungsi untuk membuat instance Prisma
const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

// Mencegah multiple instance saat development di Next.js
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Export `db` agar bisa digunakan di seluruh aplikasi
export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;