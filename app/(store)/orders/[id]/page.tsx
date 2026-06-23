import { PaymentConfirmForm } from "@/components/store/PaymentConfirmForm";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { Separator } from "@base-ui/react";
import { notFound } from "next/navigation";

async function getOrder(id: number) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      address: true,
      items: true,
      payment: true,
    },
  });
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(Number(id));

  if (!order) notFound();

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pesanan #{order.id}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {new Date(order.createdAt).toLocaleDateString("id-ID", {
            dateStyle: "long",
          })}
        </p>
      </div>

      {/* Status */}
      <div className="flex gap-2">
        <Badge variant="outline">{order.status}</Badge>
        <Badge
          variant={order.paymentStatus === "PAID" ? "default" : "destructive"}
        >
          {order.paymentStatus === "PAID" ? "Sudah dibayar" : "Belum dibayar"}
        </Badge>
      </div>

      <Separator />

      {/* Item */}
      <div className="space-y-2">
        <h2 className="font-medium">Item Pesanan</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {item.productName} x{item.quantity}
            </span>
            <span>{formatRupiah(item.price * item.quantity)}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground text-sm">
            Ongkir ({order.courier} {order.courierService})
          </span>
          <span>{formatRupiah(order.shippingCost)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatRupiah(order.totalPrice)}</span>
        </div>
      </div>

      <Separator />

      {/* Info pengiriman */}
      <div className="space-y-1 text-sm">
        <h2 className="font-medium mb-2">Alamat Pengiriman</h2>
        <p>
          {order.customer.name} - {order.customer.phone}
        </p>
        <p className="text-muted-foreground">{order.address.address}</p>
        <p className="text-muted-foreground">
          {order.address.subdistrictName}, {order.address.districtName}, {order.address.cityName},{" "}
          {order.address.provinceName}, {order.address.postalCode}
        </p>
      </div>

      <Separator />

      {/* Konfirmasi pembayaran */}
      {order.paymentStatus === "UNPAID" ? (
        <div className="space-y-3">
          <h2 className="font-medium">Konfirmasi Pembayaran</h2>
          <div className="bg-muted rounded-lg p-4 text-sm space-y-1">
            <p>Transfer ke rekening berikut:</p>
            <p className="font-medium">BCA - 12345678</p>
            <p className="font-medium">a.n. Hannan Store</p>
            <p className="text-muted-foreground">
              Total transfer:{" "}
              <span className="font-semibold text-foreground">
                {formatRupiah(order.totalPrice)}
              </span>
            </p>
          </div>
          <PaymentConfirmForm orderId={order.id} />
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 text-sm text-green-700 dark:text-green-300">
          Pembayaran sudah dikonfirmasi. Pesanan sedang diproses.
        </div>
      )}
    </div>
  );
}
