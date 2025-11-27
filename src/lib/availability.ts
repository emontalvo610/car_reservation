import { prisma } from './prisma';

export interface AvailabilityQuery {
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  dropoffLocation?: string;
  category?: string;
}

export async function findAvailableCars(query: AvailabilityQuery) {
  const { startDate, endDate, pickupLocation, category } = query;

  const allCars = await prisma.car.findMany({
    where: {
      status: { in: ['AVAILABLE', 'RESERVED'] },
      ...(category && { category: category as any }),
    },
    include: {
      reservations: {
        where: {
          status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
          OR: [
            { startDate: { gte: startDate, lt: endDate } },
            { endDate: { gt: startDate, lte: endDate } },
            { AND: [{ startDate: { lte: startDate } }, { endDate: { gte: endDate } }] },
          ],
        },
        orderBy: { endDate: 'desc' },
      },
    },
  });

  const availableCars = allCars.filter((car) => {
    if (car.reservations.length === 0) {
      return car.currentLocation === pickupLocation;
    }

    const hasOverlap = car.reservations.some((res) => 
      res.startDate < endDate && res.endDate > startDate
    );

    if (hasOverlap) return false;

    const lastReservation = car.reservations.find((res) => res.endDate <= startDate);
    if (lastReservation) {
      return lastReservation.dropoffLocation === pickupLocation;
    }

    return car.currentLocation === pickupLocation;
  });

  return availableCars.map((car) => ({
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    licensePlate: car.licensePlate,
    category: car.category,
    pricePerDay: car.pricePerDay,
    currentLocation: car.currentLocation,
  }));
}

export async function validateReservation(
  carId: string,
  startDate: Date,
  endDate: Date,
  pickupLocation: string
): Promise<{ valid: boolean; error?: string }> {
  const now = new Date();
  if (startDate <= now) {
    return { valid: false, error: 'Start date must be in the future' };
  }

  if (endDate <= startDate) {
    return { valid: false, error: 'End date must be after start date' };
  }

  const car = await prisma.car.findUnique({
    where: { id: carId },
    include: {
      reservations: {
        where: { status: { in: ['CONFIRMED', 'IN_PROGRESS'] } },
        orderBy: { endDate: 'desc' },
      },
    },
  });

  if (!car) {
    return { valid: false, error: 'Car not found' };
  }

  const hasOverlap = car.reservations.some((res) =>
    res.startDate < endDate && res.endDate > startDate
  );

  if (hasOverlap) {
    return { valid: false, error: 'Car is not available for selected dates' };
  }

  const lastReservation = car.reservations.find((res) => res.endDate <= startDate);

  if (lastReservation) {
    if (lastReservation.dropoffLocation !== pickupLocation) {
      return {
        valid: false,
        error: `Car will be at ${lastReservation.dropoffLocation}, not ${pickupLocation}`,
      };
    }
  } else if (car.currentLocation !== pickupLocation) {
    return {
      valid: false,
      error: `Car is currently at ${car.currentLocation}, not ${pickupLocation}`,
    };
  }

  return { valid: true };
}

