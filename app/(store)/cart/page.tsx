"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatRupiah } from "@/lib/utils";
import { Separator } from "@base-ui/react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, calculateTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto w-full px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Keranjang kamu kosong.</p>
        <Button variant="outline">
          <Link href="/">Mulai belanja</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-20">
      <h1 className="text-2xl font-semibold mb-6">Keranjang belanja.</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* List item */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 items-start">
              <div className="relative w-20 h-20 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="20"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-tight">{item.name}</p>
                <p className="text-primary font-semibold mt-1">
                  {formatRupiah(item.price)}
                </p>

                <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 rounded border flex  items-center justify-center text-sm hover:bg-muted">-</button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 rounded border flex  items-center justify-center text-sm hover:bg-muted">+</button>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="font-semibold text-sm">{formatRupiah(item.price * item.quantity)}</p>
                    <button onClick={() => removeItem(item.productId)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border rounded-xl p-4 h-fit space-y-3">
            <h2 className="font-semibold">Ringkasan</h2>
            <Separator/>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatRupiah(calculateTotalPrice())}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Ongkir</span>
                <span className="text-muted-foreground">Dihitung di checkout</span>
            </div>
            <Button className="w-full"><Link href="/checkout">Lanjut ke checkout</Link></Button>
        </div>
      </div>
    </div>
  );
}
