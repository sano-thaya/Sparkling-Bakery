const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'thayaparansanojan12@gmail.com';
  const hashedPassword = bcrypt.hashSync('admin123', 10);

  const admin = await prisma.user.update({
    where: { email: adminEmail },
    data: {
      passwordHash: hashedPassword
    }
  });

  console.log("Admin password properly hashed and updated!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
