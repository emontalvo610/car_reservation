import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      include: { _count: { select: { reservations: true } } },
      orderBy: { make: 'asc' },
    });

    return NextResponse.json({ cars });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { make, model, year, licensePlate, category, currentLocation, pricePerDay } = body;

    if (!make || !model || !year || !licensePlate || !category || !currentLocation || !pricePerDay) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const car = await prisma.car.create({
      data: { make, model, year, licensePlate, category, currentLocation, pricePerDay },
    });

    return NextResponse.json({ car }, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}

