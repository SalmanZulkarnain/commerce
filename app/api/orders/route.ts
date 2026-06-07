import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    customerName,
    customerEmail,
    customerPhone,
    address,
    cityId,
    cityName,
    provinceId,
    provinceName,
    postalCode,
    courier,
    courierService,
    shippingCost,
    notes,
    items,
  } = body;

  // validasi field wajib
  if (!customerName || !customerPhone || !address || !items.length) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  // ambil semua produk yang di-order sekaligus
  const productIds = items.map((item: { productId: number }) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  // validasi stok
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return NextResponse.json(
        { message: `Product with ID ${item.productId} not found` },
        { status: 404 },
      );
    }
    if (item.quantity > product.stock) {
      return NextResponse.json(
        { message: `Insufficient stock for product ${product.name}` },
        { status: 400 },
      );
    }
  }

  // hitung total harga
  const itemsTotal = items.reduce(
    (acc: number, item: { productId: number; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId)!;
      return acc + product.price * item.quantity;
    },
    0,
  );

  const totalPrice = itemsTotal + (shippingCost ?? 0);

  // buat order dalam satu transaksi
  const order = await prisma.$transaction(async (tx) => {
    // buat customer
    const customer = await tx.customer.create({
      data: {
        name: customerName,
        email: customerEmail ?? null,
        phone: customerPhone,
      },
    });

    const savedAddress = await tx.address.create({
      data: {
        customerId: customer.id,
        label: "Alamat pengiriman",
        address,
        cityId: cityId ?? "",
        cityName: cityName ?? "",
        provinceId: provinceId ?? "",
        provinceName: provinceName ?? "",
        postalCode: postalCode ?? "",
      },
    });

    // buat order
    const newOrder = await tx.order.create({
      data: {
        customerId: customer.id,
        addressId: savedAddress.id,
        courier: courier ?? "",
        courierService: courierService ?? "",
        shippingCost: shippingCost ?? 0,
        totalPrice,
        notes: notes ?? null,
        items: {
          create: items.map((item: { productId: number; quantity: number }) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: product.id,
              productName: product.name,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
      include: { items: true },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return newOrder;
  });

  return NextResponse.json(order, { status: 201 });
}
