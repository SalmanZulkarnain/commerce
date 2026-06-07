import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { orderId, bankName, accountNumber, amount, transferProof } = body;

  if (!orderId || !bankName || !accountNumber || !amount || !transferProof) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.paymentStatus === "PAID") {
    return NextResponse.json(
      {
        error: "This order has been confirmed",
      },
      { status: 400 },
    );
  }

  const confirmation = await prisma.$transaction(async (tx) => {
    const confirm = await tx.paymentConfirmation.create({
      data: {
        orderId: Number(orderId),
        bankName,
        accountNumber,
        amount,
        transferProof,
      },
    });

    await tx.order.update({
      where: { id: Number(orderId) },
      data: {
        paymentStatus: "PAID",
      },
    });

    return confirm;
  });

  return NextResponse.json(confirmation);
}
