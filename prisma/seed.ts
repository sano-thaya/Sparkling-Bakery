const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@sparklingbakery.com';
  
  // Note: For simplicity without bcrypt dependency installed yet, we're using a plain string. 
  // In a real application, you MUST hash this password using bcrypt before saving.
  const adminPasswordHash = 'admin123'; // Replace with bcrypt.hashSync('admin123', 10) in prod

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  });

  console.log({ admin });

  // Add some sample posts
  await prisma.post.create({
    data: {
      title: 'Vanilla Bean Wedding Cake',
      category: 'Wedding',
      description: 'A beautiful 3-tier vanilla bean cake with strawberry compote.',
      imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'], // Using cloudinary demo sample
    }
  });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
