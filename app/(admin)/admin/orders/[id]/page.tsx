import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrderDetailClient from "./OrderDetailClient";

export default async function AdminOrderDetailPage({
  params, 
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { customer: true, items: true, address: true, payment: true },
  });

  if (!order) notFound();
  return (
    <OrderDetailClient initialOrder={JSON.parse(JSON.stringify(order))}/>
  );
}
