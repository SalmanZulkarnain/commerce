"use client";

import { ShippingOption } from "@/components/store/CourierSelector";
import OrderSummary from "@/components/store/OrderSummary";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Address } from "@/generated/prisma/client";
import { useCart } from "@/hooks/useCart";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function CheckoutClient({
  addresses,
}: {
  addresses: Address[];
}) {
  const { items } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0].id);
  const [open, setOpen] = useState(false);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto w-full px-4 py-20 text-center">
        <p className="text-muted-foreground">Keranjang kamu kosong.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-2 space-y-4">
          {selectedAddress && (
            <div className="space-y-6">
              {/* Data diri */}
              <div className="space-y-3 bg-muted p-6 rounded-lg">
                <h2 className="font-bold text-md text-muted-foreground">
                  Alamat Pengiriman
                </h2>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold flex gap-1">
                      <svg
                        className="nest-icon css-ozd7xs"
                        width="16"
                        height="16"
                        fill="rgb(var(--GN500,0,170,91))"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.24A7.67 7.67 0 0 0 4.25 10c0 7.36 7.08 11.48 7.38 11.66a.81.81 0 0 0 .74 0c.3-.18 7.38-4.3 7.38-11.66A7.669 7.669 0 0 0 12 2.24ZM12 13a3 3 0 1 1 0-6.001A3 3 0 0 1 12 13Z"></path>
                      </svg>
                      {selectedAddress.label} • {selectedAddress.recepientName}
                    </p>
                    <p className="text-sm">
                      {selectedAddress.address},{" "}
                      {selectedAddress.subdistrictName},{" "}
                      {selectedAddress.districtName}, {selectedAddress.cityName}
                      , {selectedAddress.provinceName},{" "}
                      {selectedAddress.postalCode},{" "}
                      {selectedAddress.recepientPhone}
                    </p>
                  </div>
                  <div>
                    <Dialog open={open ?? false} onOpenChange={setOpen}>
                      <DialogTrigger>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer shrink-0"
                        >
                          Ganti Alamat
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-0">
                        <DialogHeader className="p-6 pb-2">
                          <DialogTitle className="text-center text-lg font-bold">
                            Daftar Alamat
                          </DialogTitle>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 pt-2">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Tulis Nama Alamat / Kota / Kecamatan..."
                              className="w-full border rounded-lg px-3 py-2 text-sm bg-background outline-none focus:border-green-600"
                            />
                          </div>

                          <Button
                            variant="outline"
                            className="w-full text-green-600 border-green-600 hover:bg-green-50 font-semibold"
                          >
                            Tambah Alamat Baru
                          </Button>

                          <div className="space-y-3 pt-2">
                            {addresses.map((addr) => {
                              const isSelected = addr.id === selectedAddressId;
                              return (
                                <div
                                  key={addr.id}
                                  className={`p-4 border rounded-xl relative flex flex-col gap-1 transition-all ${
                                    isSelected
                                      ? "border-green-600 bg-green-50/10"
                                      : "border-slate-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm">
                                      {addr.label}
                                    </span>
                                    {addr.id === addresses[0].id && (
                                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                        Utama
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-bold text-sm text-foreground">
                                    {addr.recepientName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {addr.recepientPhone}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {addr.address}, {addr.cityName}
                                  </p>

                                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-dashed">
                                    <button className="text-xs font-bold text-green-600 hover:underline">
                                      Ubah Alamat
                                    </button>

                                    {!isSelected ? (
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-4"
                                        onClick={() => {
                                          setSelectedAddressId(addr.id);
                                          setOpen(false); // Close modal on choice
                                        }}
                                      >
                                        Pilih
                                      </Button>
                                    ) : (
                                      <span className="text-xs font-bold text-green-600 bg-green-100/50 px-2.5 py-1 rounded-full">
                                        Terpilih
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Alamat */}
              <div className="space-y-3 bg-muted p-6 rounded-lg">
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-4 items-start"
                    >
                      <div className="relative w-20 h-20 overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="20"
                          unoptimized
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 justify-between min-w-0">
                        <p className="font-medium text-sm leading-tight">
                          {item.name}
                        </p>

                        <p className="text-sm text-muted-foreground mt-2">
                          jenis kalo ada
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-bold">
                          <span>{item.quantity} x </span>
                          {formatRupiah(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Pilih kurir */}
          {/* <CourierSelector shippingOptions={shippingOptions} onSelectCourier={setSelectedShipping} selectedShipping={selectedShipping} /> */}
        </div>

        {/* Summary */}
        <OrderSummary
          items={items}
          totalPrice={calculateTotalPrice()}
          selectedShipping={selectedShipping}
          selectedAddress={selectedAddress}
          loadingOrder={loadingOrder}
          onCreateOrder={handleOrder}
        />
      </div>
    </div>
  );
}
