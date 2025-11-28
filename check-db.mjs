import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

async function check() {
  const carCount = await prisma.car.count();
  const userCount = await prisma.user.count();
  const locationCount = await prisma.location.count();
  
  console.log(`Cars: ${carCount}`);
  console.log(`Users: ${userCount}`);
  console.log(`Locations: ${locationCount}`);
  
  if (carCount > 0) {
    const cars = await prisma.car.findMany({ take: 3 });
    console.log('\nSample cars:');
    cars.forEach(car => console.log(`- ${car.year} ${car.make} ${car.model} (${car.licensePlate})`));
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

