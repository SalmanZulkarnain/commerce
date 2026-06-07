import { prisma } from "@/lib/prisma"

async function main() {
    // Categories
  const olahraga = await prisma.category.upsert({
    where: { slug: "olahraga-outdoor" },
    update: {},
    create: { name: "Olahraga & Outdoor", slug: "olahraga-outdoor" },
  });

  const hobi = await prisma.category.upsert({
    where: { slug: "hobi-koleksi" },
    update: {},
    create: { name: "Hobi & Koleksi", slug: "hobi-koleksi" },
  });

  // Products
  await prisma.product.upsert({
    where: { slug: "arrow-carbon-1416" },
    update: {},
    create: {
      categoryId: olahraga.id,
      name: "Arrow Carbon 1416",
      slug: "arrow-carbon-1416",
      description: "Anak panah karbon berkualitas tinggi ukuran 1416",
      price: 44500,
      stock: 100,
      weight: 50,
      isActive: true,
      images: {
        create: {
          imageUrl: "https://placehold.co/400x400?text=Arrow+Carbon",
          isPrimary: true,
        },
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "thumbring-kulit" },
    update: {},
    create: {
      categoryId: hobi.id,
      name: "Thumbring Kulit",
      slug: "thumbring-kulit",
      description: "Thumbring sulam dari kulit asli untuk memanah",
      price: 35000,
      stock: 50,
      weight: 30,
      isActive: true,
      images: {
        create: {
          imageUrl: "https://placehold.co/400x400?text=Thumbring",
          isPrimary: true,
        },
      },
    },
  });

  console.log("Seed selesai!");
}

main()
.then(async () => {
    await prisma.$disconnect();
})
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit();
})