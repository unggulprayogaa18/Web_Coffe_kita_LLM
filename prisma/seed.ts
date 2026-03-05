// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Kita pakai dummy URL untuk sementara jika DATABASE_URL di .env masih kosong
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/mydb";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Cukup deklarasikan SATU kali saja yang menggunakan adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Memulai proses seeding data pelanggan Kopi Kita...');

  // Hapus data lama agar tidak duplikat saat dijalankan ulang
  await prisma.customer.deleteMany();

  const customers = [
    {
      name: 'Andi Setiawan',
      contact: 'andi@example.com',
      favoriteDrink: 'Caramel Macchiato',
      interests: ['sweet drinks', 'caramel', 'morning buyer'],
    },
    {
      name: 'Siti Rahma',
      contact: '08123456789',
      favoriteDrink: 'Iced Latte with Oat Milk',
      interests: ['oat milk', 'coffee', 'weekend'],
    },
    {
      name: 'Budi Santoso',
      contact: 'budi@example.com',
      favoriteDrink: 'Americano',
      interests: ['black coffee', 'morning buyer', 'pastry lover'],
    },
    {
      name: 'Diana Putri',
      contact: 'diana.p@example.com',
      favoriteDrink: 'Matcha Frappe',
      interests: ['sweet drinks', 'non-coffee', 'afternoon chill'],
    },
    {
      name: 'Reza Rahadian',
      favoriteDrink: 'Cappuccino + Croissant',
      interests: ['coffee', 'pastry lover', 'morning buyer'],
    },
  ];

  for (const customer of customers) {
    await prisma.customer.create({
      data: customer,
    });
  }

  console.log('Seeding selesai! 5 pelanggan berhasil ditambahkan.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });