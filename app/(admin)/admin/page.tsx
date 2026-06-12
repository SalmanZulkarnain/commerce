import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";

interface Order {
  id: number;
  customerId: number;
  addressId: number;
  courier: string;
  courierService: string;
  shippingCost: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  notes: string | null;
  createdAt: Date;
}

export default async function AdminListOrderPage({}: { orders: Order }) {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">ID</TableHead>
            <TableHead>Pelanggan</TableHead>
            <TableHead className="font-semibold text-gray-700">
              Kurir / Layanan
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Status Bayar
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Status Order
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Tanggal
            </TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((odr) => (
            <TableRow key={odr.id}>
              <TableCell className="font-medium">{odr.id}</TableCell>
              <TableCell>{odr.customer.name}</TableCell>
              <TableCell>
                {odr.courier.toUpperCase()} - {odr.courierService}
              </TableCell>
              <TableCell>{odr.paymentStatus}</TableCell>
              <TableCell>{odr.status}</TableCell>
              <TableCell>
                {odr.createdAt.toLocaleDateString("id-ID", {
                  dateStyle: "medium",
                })}
              </TableCell>

              <TableCell>{odr.payment?.bankName ?? "Belum Bayar"}</TableCell>
              <TableCell className="text-right">
                {formatRupiah(odr.payment?.amount ?? 0)}
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/orders/${odr.id}`}
                  className="text-primary text-sm hover:underline"
                >
                  Lihat Detail
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
