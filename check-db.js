const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL.replace(':5432', ':6543')
    }
  }
});

async function main() {
  const users = await prisma.user.findMany();
  console.log("USERS IN DATABASE:", users.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
