// src/app/api/customers/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Untuk mengambil semua data pelanggan
export async function GET() {
  try {
    const customers = await db.customer.findMany({
      orderBy: { createdAt: 'desc' } // Urutkan dari yang terbaru
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: 'Gagal mengambil data pelanggan' }, { status: 500 });
  }
}

// POST: Untuk menambahkan pelanggan baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, favoriteDrink, interests } = body;

    // Validasi sederhana: Pastikan nama diisi
    if (!name) {
      return NextResponse.json({ error: 'Nama pelanggan wajib diisi' }, { status: 400 });
    }

    const newCustomer = await db.customer.create({
      data: {
        name,
        contact,
        favoriteDrink,
        interests, // Pastikan formatnya array string dari frontend
      },
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: 'Gagal menambah pelanggan' }, { status: 500 });
  }
}