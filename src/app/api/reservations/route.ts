import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateReservation } from '@/lib/availability';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    const reservations = await prisma.reservation.findMany({
      where: {
        ...(userId && { userId }),
        ...(email && { user: { email } }),
      },
      include: {
        car: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, carId, startDate, endDate, pickupLocation, dropoffLocation, notes } = body;

    if (!userId || !carId || !startDate || !endDate || !pickupLocation || !dropoffLocation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const validation = await validateReservation(carId, start, end, pickupLocation);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        carId,
        startDate: start,
        endDate: end,
        pickupLocation,
        dropoffLocation,
        totalPrice,
        notes,
        status: 'CONFIRMED',
      },
      include: {
        car: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    await prisma.car.update({
      where: { id: carId },
      data: { status: 'RESERVED' },
    });

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}

