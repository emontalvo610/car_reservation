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

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    },
  });

  console.log('Seed data created successfully!');
  console.log('- 5 locations');
  console.log('- 8 cars');
  console.log('- 1 user');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

