import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

async function main() {
  await prisma.location.createMany({
    data: [
      { name: 'JFK Airport', city: 'New York', state: 'NY' },
      { name: 'Logan Airport', city: 'Boston', state: 'MA' },
      { name: 'LAX Airport', city: 'Los Angeles', state: 'CA' },
      { name: 'ORD Airport', city: 'Chicago', state: 'IL' },
      { name: 'Downtown', city: 'San Francisco', state: 'CA' },
    ],
  });

  await prisma.car.createMany({
    data: [
      {
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        licensePlate: 'ABC123',
        category: 'MIDSIZE',
        currentLocation: 'New York',
        pricePerDay: 45,
      },
      {
        make: 'Honda',
        model: 'Civic',
        year: 2024,
        licensePlate: 'XYZ789',
        category: 'COMPACT',
        currentLocation: 'Boston',
        pricePerDay: 35,
      },
      {
        make: 'Ford',
        model: 'Explorer',
        year: 2023,
        licensePlate: 'SUV456',
        category: 'SUV',
        currentLocation: 'Los Angeles',
        pricePerDay: 65,
      },
      {
        make: 'Chevrolet',
        model: 'Spark',
        year: 2022,
        licensePlate: 'ECO111',
        category: 'ECONOMY',
        currentLocation: 'Chicago',
        pricePerDay: 25,
      },
      {
        make: 'BMW',
        model: '5 Series',
        year: 2024,
        licensePlate: 'LUX888',
        category: 'LUXURY',
        currentLocation: 'San Francisco',
        pricePerDay: 120,
      },
      {
        make: 'Tesla',
        model: 'Model 3',
        year: 2024,
        licensePlate: 'EV2024',
        category: 'MIDSIZE',
        currentLocation: 'New York',
        pricePerDay: 85,
      },
      {
        make: 'Jeep',
        model: 'Grand Cherokee',
        year: 2023,
        licensePlate: 'JEP999',
        category: 'SUV',
        currentLocation: 'Boston',
        pricePerDay: 70,
      },
      {
        make: 'Mercedes',
        model: 'E-Class',
        year: 2024,
        licensePlate: 'MER777',
        category: 'LUXURY',
        currentLocation: 'Los Angeles',
        pricePerDay: 130,
      },
    ],
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1987654321',
    },
  });

  const cars = await prisma.car.findMany();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const twoWeeks = new Date();
  twoWeeks.setDate(twoWeeks.getDate() + 14);
  const threeWeeks = new Date();
  threeWeeks.setDate(threeWeeks.getDate() + 21);

  await prisma.reservation.createMany({
    data: [
      {
        userId: user1.id,
        carId: cars[0].id,
        startDate: tomorrow,
        endDate: new Date(tomorrow.getTime() + 3 * 24 * 60 * 60 * 1000),
        pickupLocation: 'New York',
        dropoffLocation: 'Boston',
        totalPrice: 135,
        status: 'CONFIRMED',
      },
      {
        userId: user2.id,
        carId: cars[1].id,
        startDate: nextWeek,
        endDate: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000),
        pickupLocation: 'Boston',
        dropoffLocation: 'New York',
        totalPrice: 175,
        status: 'CONFIRMED',
      },
      {
        userId: user1.id,
        carId: cars[2].id,
        startDate: twoWeeks,
        endDate: new Date(twoWeeks.getTime() + 4 * 24 * 60 * 60 * 1000),
        pickupLocation: 'Los Angeles',
        dropoffLocation: 'San Francisco',
        totalPrice: 260,
        status: 'PENDING',
      },
      {
        userId: user2.id,
        carId: cars[4].id,
        startDate: tomorrow,
        endDate: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000),
        pickupLocation: 'San Francisco',
        dropoffLocation: 'Los Angeles',
        totalPrice: 240,
        status: 'IN_PROGRESS',
        notes: 'Early pickup requested',
      },
    ],
  });

  console.log('Seed data created successfully!');
  console.log('- 5 locations');
  console.log('- 8 cars');
  console.log('- 2 users');
  console.log('- 4 reservations');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

