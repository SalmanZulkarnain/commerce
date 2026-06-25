import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminListOrderPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    redirect("/")
  }
  
  const orders = await prisma.order.findMany({
    include: {
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full px-8 py-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header Dashboard */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Orders</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage and track your customer store invoices.</p>
          </div>
          <div className="text-xs font-semibold text-blue-600 bg-blue-50/60 px-3 py-1.5 rounded-lg border border-blue-100">
            {orders.length} Total Orders
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden">

          {/* Tampilan Fake Search & Filter */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium text-slate-400 border border-slate-200 rounded-lg px-3 py-1.5 bg-white shadow-2xs w-64">
                Search order...
              </div>
              <div className="text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 bg-white shadow-2xs flex items-center gap-1.5 cursor-not-allowed opacity-70">
                <span>Filter</span>
              </div>
            </div>
            <div className="text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 bg-white shadow-2xs cursor-not-allowed opacity-70">
              Columns
            </div>
          </div>

          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="w-22.5 font-semibold text-slate-500 text-xs tracking-wider pl-6">ORDER ID</TableHead>
                <TableHead className="font-semibold text-slate-500 text-xs tracking-wider">PELANGGAN</TableHead>
                <TableHead className="font-semibold text-slate-500 text-xs tracking-wider">PAYMENT STATUS</TableHead>
                <TableHead className="font-semibold text-slate-500 text-xs tracking-wider">ORDER STATUS</TableHead>
                <TableHead className="font-semibold text-slate-500 text-xs tracking-wider">SHIPPING METHOD</TableHead>
                <TableHead className="font-semibold text-slate-500 text-xs tracking-wider">DATE ADDED</TableHead>
                <TableHead className="font-semibold text-slate-500 text-xs tracking-wider">METHOD</TableHead>
                <TableHead className="text-right font-semibold text-slate-500 text-xs tracking-wider pr-6">TOTAL</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((odr) => (
                <TableRow
                  key={odr.id}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors duration-150 group"
                >
                  {/* Order ID */}
                  <TableCell className="p-0 pl-6 font-mono text-xs font-bold text-slate-700">
                    <Link href={`/admin/orders/${odr.id}`} className="block w-full h-full py-4.5">
                      #{odr.id}
                    </Link>
                  </TableCell>

                  {/* Nama Pelanggan */}
                  <TableCell className="p-0 font-medium text-slate-900 text-[14px]">
                    <Link href={`/admin/orders/${odr.id}`} className="block w-full h-full py-4.5">
                      {odr.customer?.name || "No Name"}
                    </Link>
                  </TableCell>

                  {/* Payment Status */}
                  <TableCell className="p-0">
                    <Link href={`/admin/orders/${odr.id}`} className="flex items-center w-full h-full py-4.5">
                      {odr.paymentStatus === "PAID" ? (
                        <Badge variant="outline" className="bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]/60 font-semibold px-2.5 py-0.5 rounded-md text-[11px] shadow-2xs">
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]/60 font-semibold px-2.5 py-0.5 rounded-md text-[11px] shadow-2xs">
                          Unpaid
                        </Badge>
                      )}
                    </Link>
                  </TableCell>

                  {/* Order Status */}
                  <TableCell className="p-0">
                    <Link href={`/admin/orders/${odr.id}`} className="flex items-center w-full h-full py-4.5">
                      {odr.status === "PENDING" ? (
                        <Badge variant="outline" className="bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]/60 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">
                          New Order
                        </Badge>
                      ) : odr.status === "CONFIRMED" ? (
                        <Badge variant="outline" className="bg-[#f5f3ff] text-[#7c3aed] border-[#ddd6fe]/60 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">
                          Ready to Ship
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">
                          {odr.status}
                        </Badge>
                      )}
                    </Link>
                  </TableCell>

                  {/* Shipping Method */}
                  <TableCell className="p-0 text-slate-600 text-xs font-medium">
                    <Link href={`/admin/orders/${odr.id}`} className="block w-full h-full py-4.5">
                      <span className="text-slate-800 font-semibold">{odr.courier.toUpperCase()}</span>
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span className="text-slate-500">{odr.courierService}</span>
                    </Link>
                  </TableCell>

                  {/* Date Added */}
                  <TableCell className="p-0 text-slate-500 text-xs font-medium">
                    <Link href={`/admin/orders/${odr.id}`} className="block w-full h-full py-4.5">
                      {new Date(odr.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Link>
                  </TableCell>

                  {/* Method Bank */}
                  <TableCell className="p-0 text-slate-600 text-xs font-semibold">
                    <Link href={`/admin/orders/${odr.id}`} className="block w-full h-full py-4.5">
                      {odr.payment?.bankName ?? "--"}
                    </Link>
                  </TableCell>

                  {/* Total Amount */}
                  <TableCell className="p-0 text-right font-sans font-bold text-slate-900 text-[14px] pr-6">
                    <Link href={`/admin/orders/${odr.id}`} className="block w-full h-full py-4.5 group-hover:text-blue-600 transition-colors">
                      {formatRupiah(odr.payment?.amount ?? 0)}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}