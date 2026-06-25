import { prisma } from "@/lib/prisma"

async function main() {
  console.log('Clearing existing data...');
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('Seeding categories...');
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', slug: 'electronics' },
  });

  const apparel = await prisma.category.create({
    data: { name: 'Pakaian & Fashion', slug: 'pakaian-fashion' },
  });

  const homeLiving = await prisma.category.create({
    data: { name: 'Home & Living', slug: 'home-living' },
  });

  console.log('Seeding products linked to real Cloudinary assets...');

  // 1. Electronics Products
  await prisma.product.create({
    data: {
      categoryId: electronics.id,
      name: 'Wireless Mechanical Keyboard RGB',
      slug: 'wireless-mechanical-keyboard-rgb',
      description: 'Keyboard mekanikal wireless dengan switch premium, RGB backlighting hotswappable, dan baterai tahan lama up to 200 jam.',
      price: 850000,
      stock: 25,
      weight: 950,
      width: 35,
      height: 4,
      length: 14,
      isActive: true,
      images: {
        create: [
          {
            imageUrl: 'https://res.cloudinary.com/djo6doyon/image/upload/c_scale,w_800/f_auto,q_auto/v1781778228/photo-1587829741301-dc798b83add3_ugewes.jpg',
            publicId: 'photo-1587829741301-dc798b83add3_ugewes',
            isPrimary: true
          },
          {
            imageUrl: 'https://res.cloudinary.com/djo6doyon/image/upload/c_scale,w_800/f_auto,q_auto/v1781778242/photo-1618384887929-16ec33fab9ef_xyo9cy.jpg',
            publicId: 'photo-1618384887929-16ec33fab9ef_xyo9cy',
            isPrimary: false
          }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      categoryId: electronics.id,
      name: 'TWS Noise Cancelling Earbuds',
      slug: 'tws-noise-cancelling-earbuds',
      description: 'Earbuds nirkabel dengan Active Noise Cancellation (ANC) tingkat tinggi, bass mendalam, dan rating IPX5 tahan air.',
      price: 450000,
      stock: 40,
      weight: 150,
      width: 6,
      height: 3,
      length: 6,
      isActive: true,
      images: {
        create: [
          {
            imageUrl: 'https://res.cloudinary.com/djo6doyon/image/upload/c_scale,w_800/f_auto,q_auto/v1781778215/photo-1590658268037-6bf12165a8df_y5ouyd.jpg',
            publicId: 'photo-1590658268037-6bf12165a8df_y5ouyd',
            isPrimary: true
          }
        ]
      }
    }
  });

  // 2. Apparel Products
  await prisma.product.create({
    data: {
      categoryId: apparel.id,
      name: 'Oversized Cotton Hoodie Black',
      slug: 'oversized-cotton-hoodie-black',
      description: 'Hoodie berbahan katun fleece premium 330gsm yang tebal namun tetap adem dipakai seharian. Unisex fit.',
      price: 299000,
      stock: 50,
      weight: 600,
      width: 30,
      height: 5,
      length: 35,
      isActive: true,
      images: {
        create: [
          {
            imageUrl: 'https://res.cloudinary.com/djo6doyon/image/upload/c_scale,w_800/f_auto,q_auto/v1781778208/photo-1556821840-3a63f95609a7_dxhvve.jpg',
            publicId: 'photo-1556821840-3a63f95609a7_dxhvve',
            isPrimary: true
          }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      categoryId: apparel.id,
      name: 'Sandal Slide Slip-on Casual',
      slug: 'sandal-slide-slip-on-casual',
      description: 'Sandal slide kasual berbahan phylon ringan, empuk, anti slip, cocok digunakan untuk santai di dalam maupun luar rumah.',
      price: 120000,
      stock: 15,
      weight: 350,
      width: 12,
      height: 10,
      length: 28,
      isActive: true,
      images: {
        create: [
          {
            imageUrl: 'https://res.cloudinary.com/djo6doyon/image/upload/c_scale,w_800/f_auto,q_auto/v1781778186/photo-1603487742131-4160ec999306_uisijg.jpg',
            publicId: 'photo-1603487742131-4160ec999306_uisijg',
            isPrimary: true
          }
        ]
      }
    }
  });

  // 3. Home & Living Products
  await prisma.product.create({
    data: {
      categoryId: homeLiving.id,
      name: 'Botol Minum Tumbler Stainless Termos 500ml',
      slug: 'botol-minum-tumbler-stainless-termos-500ml',
      description: 'Tumbler vacuum insulated stainless steel SUS304. Menjaga suhu air panas hingga 12 jam dan air dingin hingga 24 jam.',
      price: 135000,
      stock: 100,
      weight: 400,
      width: 7,
      height: 23,
      length: 7,
      isActive: true,
      images: {
        create: [
          {
            imageUrl: 'https://res.cloudinary.com/djo6doyon/image/upload/c_scale,w_800/f_auto,q_auto/v1781778161/photo-1602143407151-7111542de6e8_fgfcwg.jpg',
            publicId: 'photo-1602143407151-7111542de6e8_fgfcwg',
            isPrimary: true
          }
        ]
      }
    }
  });

  await prisma.address.create({
    data: {
      userId: "cmqt7gnxu0000vmekzxhkbxh9",
      recepientName: "Saul",
      recepientPhone: "082378395553",
      label: "Kantor", 
      address: "Jl. Kenanga Bunga Indah No 23B", 
      biteshipAreaId: "IDNP6IDNC148IDND843IDZ12250", 
      subdistrictName: "Pesanggrahan", 
      districtName: "Pesanggrahan", 
      cityName: "Jakarta Selatan", 
      provinceName: "DKI Jakarta", 
      postalCode: "12250",
      isPrimary: true
    }
  });

  await prisma.address.create({
    data: {
      userId: "cmqt7gnxu0000vmekzxhkbxh9",
      recepientName: "Santoso",
      recepientPhone: "082438290523",
      label: "Rumah", 
      address: "Jl. Mawar Wangi No. 10", 
      biteshipAreaId: "IDNP6IDNC148IDND836IDZ12410", 
      subdistrictName: "Cilandak", 
      districtName: "Cilandak", 
      cityName: "Jakarta Selatan", 
      provinceName: "DKI Jakarta", 
      postalCode: "12410",
      isPrimary: false
    }
  });

  console.log('Seeding completed successfully!');
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