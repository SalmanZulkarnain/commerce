"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/utils";
import { OrderStatus, Prisma } from "@/app/generated/prisma/client";

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    address: true;
    items: true;
    payment: true;
  };
}>;

interface OrderDetailClientProps {
  initialOrder: OrderWithRelations;
}

export default function OrderDetailClient({
  initialOrder,
}: OrderDetailClientProps) {
  const [order, setOrder] = useState<OrderWithRelations>(initialOrder);

  // Menghitung total harga produk saja
  const subtotalItems = order?.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleStatusChange = async (newStatus: OrderStatus | null) => {
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!res) throw new Error("Gagal memperbarui data");

      setOrder({ ...order, status: newStatus as OrderWithRelations["status"] });
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto px-4 py-8 space-y-3">
      {/* No Pesanan */}
      <h1 className="font-semibold text-2xl">Pesanan #{order.id}</h1>

      {/* Tanggal Pembelian */}
      <p className="text-muted-foreground text-sm">
        {new Date(order.createdAt).toLocaleDateString("id-ID", {
          dateStyle: "long",
        })}
      </p>

      {/* Status */}
      {order?.status && (
        <div className="flex gap-2 items-center">
          <Badge variant="outline">{order.status}</Badge>
          <Badge>
            {order.paymentStatus === "PAID" ? "Sudah dibayar" : "Belum dibayar"}
          </Badge>
          <Select value={order.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-45">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                <SelectItem value="DONE">DONE</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Info pengiriman */}
      <div className="space-y-3">
        <h2 className="font-medium">Info Pengiriman</h2>
        <div className="grid  grid-cols-[120px_15px_1fr] gap-y-2 text-sm">
          <p className="text-muted-foreground">Kurir</p>
          <p>:</p>
          <p>
            {order.courier.toUpperCase()} - {order.courierService}
          </p>

          <p className="text-muted-foreground">No Resi</p>
          <p>:</p>
          <p>{order.notes ?? "No resi belum di-update"}</p>

          <p className="text-muted-foreground">Alamat</p>
          <p>:</p>
          <div>
            <p className="font-medium">{order.customer.name}</p>
            <p>
              {order.customer.phone}
              <br />
              {order.address.address}
              <br />
              {order.address.districtName}, {order.address.cityName}
              <br />
              {order.address.provinceName} {order.address.postalCode}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">Item Pesanan</h2>
        <Separator />
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground ">
                {item.productName} x{item.quantity}
              </span>
              <span>{formatRupiah(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rincian pembayaran */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <h2 className="font-medium">Rincian Pembayaran</h2>
          {order.payment?.transferProof && (
            <div className="relative border border-gray-200 rounded-lg group bg-gray-100">
              <a
                href={order.payment.transferProof}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white text-gray-900 rounded-md font-medium text-xs shadow-sm"
              >
                Lihat bukti pembayaran ↗
              </a>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Metode pembayaran</span>
          <div className="text-right">
            <p className="font-medium">
              {order.payment?.bankName || "Belum Bayar"}
            </p>
            <p className="text-muted-foreground">
              {order.payment?.accountNumber}
            </p>
          </div>
        </div>
        {order.payment?.amount && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Jumlah Transfer</span>
            <span>{formatRupiah(order.payment?.amount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal harga produk</span>
          <span>{formatRupiah(subtotalItems)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">
            Biaya ongkos kirim ({order.courier.toUpperCase()} -{" "}
            {order.courierService})
          </span>
          <span className="text-sm">{formatRupiah(order.shippingCost)}</span>
        </div>
        <hr className="border-t border-dashed border-gray-200 my-2" />
        <div className="flex justify-between font-semibold ">
          <h2>Total belanja</h2>
          <span>{formatRupiah(order.totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
