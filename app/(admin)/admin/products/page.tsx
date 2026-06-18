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
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";
import { deleteProductAction } from "./actions";

export default async function AdminListProductPage() {
  // Ambil data produk terbaru dari database
  const products = await prisma.product.findMany({
    include: { images: { where: { isPrimary: true }}},
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full px-8 py-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Header List Produk */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Products
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage stock, retail prices, and product details.
            </p>
          </div>

          {/* Tombol Tambah Produk Menuju Form */}
          <Link
            href="/admin/products/add"
            className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <span>+ Add Product</span>
          </Link>
        </div>

        {/* MAIN CONTAINER TABEL */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs overflow-hidden">
          {/* Fake Sub-Menu Filter Tab ala Tokped */}
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/40 flex items-center gap-6">
            <span className="text-xs font-bold text-blue-600 border-b-2 border-blue-600 pb-3 pt-1 cursor-pointer">
              All ({products.length})
            </span>
            <span className="text-xs font-medium text-slate-400 pb-3 pt-1 cursor-not-allowed opacity-70">
              Active (0)
            </span>
            <span className="text-xs font-medium text-slate-400 pb-3 pt-1 cursor-not-allowed opacity-70">
              Out of Stock (0)
            </span>
          </div>

          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-b border-slate-100">
                <TableHead className="font-semibold text-slate-500 text-xs tracking-wider pl-6 py-3.5">
                  PRODUCT INFO
                </TableHead>
                <TableHead className="font-semibold text-slate-500 text-xs tracking-wider py-3.5">
                  PRICE
                </TableHead>
                <TableHead className="font-semibold text-slate-500 text-xs tracking-wider py-3.5">
                  STOCK
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-500 text-xs tracking-wider pr-6 py-3.5">
                  ACTION
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-12 text-sm text-slate-400 font-medium"
                  >
                    Belum ada produk yang ditambahkan blay.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((prod) => {
                  return (
                    <TableRow
                      key={prod.id}
                      className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors duration-150 group"
                    >
                      <TableCell className="py-4.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase overflow-hidden relative">
                            {prod.images && prod.images.length > 0 ? (
                              <Image
                                src={prod.images[0].imageUrl}
                                fill
                                sizes="20"
                                unoptimized
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>No Pic</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-[14px] line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              ID: #{prod.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Harga Produk */}
                      <TableCell className="py-4.5 text-sm font-semibold text-slate-800">
                        {formatRupiah(prod.price)}
                      </TableCell>

                      {/* Jumlah Stok */}
                      <TableCell className="py-4.5 text-sm font-medium">
                        {prod.stock <= 5 ? (
                          <span className="text-amber-600 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-xs">
                            {prod.stock} Left
                          </span>
                        ) : (
                          <span className="text-slate-600 font-semibold">
                            {prod.stock} pcs
                          </span>
                        )}
                      </TableCell>

                      {/* Tombol Aksi */}
                      <TableCell className="py-4.5 text-right pr-6">
                        <Link
                          href={`/admin/products/${prod.id}/edit`}
                          className="text-xs font-semibold text-slate-600 hover:text-blue-600 border border-slate-200 bg-white shadow-2xs px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <form
                          action={deleteProductAction}
                          >
                          <input type="hidden" value={prod.id} name="id"/>
                          <button type="submit" className="text-xs font-semibold text-slate-600 hover:text-blue-600 border border-slate-200 bg-white shadow-2xs px-3 py-1.5 rounded-lg transition-colors">Remove</button>
                        </form>
                      </TableCell>
                      
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
