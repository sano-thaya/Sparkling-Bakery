const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // ── Admin user ──────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'thayaparansanojan12@gmail.com';
  const hashedPassword = bcrypt.hashSync('admin123', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: hashedPassword, role: 'admin' },
    create: {
      email: adminEmail,
      name: 'Admin',
      passwordHash: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin user seeded');

  // ── Sample gallery posts ────────────────────────────────────────────────────
  // Uses Cloudinary's built-in demo/sample images (no account needed)
  const posts = [
    {
      title: 'Strawberry Dream Cake',
      category: 'Birthday',
      description: 'A stunning 2-tier strawberry cake with fresh cream and edible florals.',
      imageUrls: ['https://res.cloudinary.com/demo/image/upload/v1563282877/cake.jpg'],
    },
    {
      title: 'Classic Vanilla Wedding Tier',
      category: 'Wedding',
      description: 'Elegant 3-tier vanilla sponge with white fondant and gold leaf accents.',
      imageUrls: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    },
    {
      title: 'Chocolate Fudge Celebration',
      category: 'Anniversary',
      description: 'Rich dark chocolate ganache cake with a glossy mirror glaze finish.',
      imageUrls: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80'],
    },
    {
      title: 'Pink Ombre Delight',
      category: 'Birthday',
      description: 'A gorgeous ombre fade from white to hot pink, finished with meringue kisses.',
      imageUrls: ['https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80'],
    },
    {
      title: 'Naked Rustic Wedding Cake',
      category: 'Wedding',
      description: 'A natural, rustic naked cake with fresh berries and greenery.',
      imageUrls: ['https://images.unsplash.com/photo-1519869325930-281384150729?w=800&q=80'],
    },
    {
      title: 'Floral Fantasy Cake',
      category: 'Special Occasion',
      description: 'Hand-piped buttercream flowers in full bloom, perfect for garden parties.',
      imageUrls: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80'],
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.title.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: { ...post, id: post.title.toLowerCase().replace(/ /g, '-') },
    });
  }
  console.log(`✅ ${posts.length} gallery posts seeded`);

  // ── Default settings ─────────────────────────────────────────────────────────
  const existing = await prisma.settings.findFirst();
  if (!existing) {
    await prisma.settings.create({ data: { baseAmount: 150 } });
    console.log('✅ Default settings seeded');
  }

  console.log('\n🎉 Seeding complete!');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
