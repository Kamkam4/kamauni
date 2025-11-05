const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkFaculties() {
  const faculties = await prisma.faculty.findMany();
  console.log('Current faculties:', faculties);
  await prisma.$disconnect();
}

checkFaculties().catch(console.error);