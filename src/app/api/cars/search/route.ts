import { NextResponse } from 'next/server';
import { findAvailableCars } from '@/lib/availability';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { startDate, endDate, pickupLocation, dropoffLocation, category } = body;

    if (!startDate || !endDate || !pickupLocation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const availableCars = await findAvailableCars({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pickupLocation,
      dropoffLocation,
      category,
    });

    return NextResponse.json({ cars: availableCars });
  } catch (error) {
    console.error('Error searching cars:', error);
    return NextResponse.json({ error: 'Failed to search cars' }, { status: 500 });
  }
}

