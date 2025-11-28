import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        car: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json({ error: 'Failed to fetch reservation' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { car: true },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        car: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (status === 'COMPLETED') {
      await prisma.car.update({
        where: { id: reservation.carId },
        data: { currentLocation: reservation.dropoffLocation, status: 'AVAILABLE' },
      });
    } else if (status === 'IN_PROGRESS') {
      await prisma.car.update({
        where: { id: reservation.carId },
        data: { status: 'IN_USE' },
      });
    } else if (status === 'CONFIRMED') {
      if (!['IN_USE', 'MAINTENANCE'].includes(reservation.car.status)) {
        await prisma.car.update({
          where: { id: reservation.carId },
          data: { status: 'RESERVED' },
        });
      }
    } else if (status === 'CANCELLED') {
      const others = await prisma.reservation.findMany({
        where: {
          carId: reservation.carId,
          id: { not: id },
          status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
        },
      });

      if (others.length === 0) {
        await prisma.car.update({
          where: { id: reservation.carId },
          data: { status: 'AVAILABLE' },
        });
      }
    }

    return NextResponse.json({ reservation: updated });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}

