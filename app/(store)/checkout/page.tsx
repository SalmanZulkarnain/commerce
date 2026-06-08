"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/useCart";
import { formatRupiah } from "@/lib/utils";
import { Separator } from "@base-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ShippingOption {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  districtId: string;
  districtName: string;
  cityName: string;
  proviceId: string;
  provinceName: string;
  postalCode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalWeight, clearCart } = useCart();

  const [form, setForm] = useState<FormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    districtId: "",
    districtName: "",
    cityName: "",
    proviceId: "",
    provinceName: "",
    postalCode: "",
  });

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckOngkir = async () => {
    if (!form.districtId) {
      alert("Isi kecamatan dulu");
      return;
    }
    setLoadingShipping(true);
    setSelectedShipping(null);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: form.districtId,
          weight: totalWeight(),
        }),
      });

      const data = await res.json();
      console.log(data)
      setShippingOptions(data.data ?? []);
    } catch {
      alert("Gagal mengambil data ongkir");
    } finally {
      setLoadingShipping(false);
    }
  };

  const handleOrder = async () => {
    if (!selectedShipping) {
      alert("Pilih kurir dulu");
      return;
    }
    setLoadingOrder(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail,
          address: form.address,
          districtId: form.districtId,
          districtName: form.districtName,
          cityName: form.cityName,
          provinceId: form.provinceName,
          provinceName: form.provinceName,
          postalCode: form.postalCode,
          courier: selectedShipping.code,
          courierService: selectedShipping.service,
          shippingCost: selectedShipping.cost,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const order = await res.json();
      clearCart();
      router.push(`/orders/${order.id}`);
    } catch { 
      alert("Gagal membuat order");
    } finally {
      setLoadingOrder(false);
    }
  };

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
        <div className="md:col-span-2 space-y-6">
          {/* Data diri */}
          <div className="space-y-3">
            <h2 className="font-medium">Data Penerima</h2>
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Budi Santoso"
              />
            </div>
            <div className="space-y-2">
              <Label>No WhatsApp</Label>
              <Input
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                placeholder="08123456789"
              />
            </div>
            <div className="space-y-2">
              <Label>Email (opsional)</Label>
              <Input
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleChange}
                placeholder="budisantoso@email.com"
              />
            </div>
          </div>

          <Separator />
          {/* Alamat */}
          <div className="space-y-3">
            <h2 className="font-medium">Alamat Pengiriman</h2>
            <div className="space-y-2">
              <Label>Alamat Lengkap</Label>
              <Input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Jl. Merdeka No. 10"
              />
            </div>
            <div className="space-y-2">
              <Label>Provinsi</Label>
              <Input
                name="provinceName"
                value={form.provinceName}
                onChange={handleChange}
                placeholder="DKI Jakarta"
              />
            </div>
            <div className="space-y-2">
              <Label>Kota</Label>
              <Input
                name="cityName"
                value={form.cityName}
                onChange={handleChange}
                placeholder="Jakarta Selatan"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Kecamatan</Label>
                <Input
                  name="districtName"
                  value={form.districtName}
                  onChange={handleChange}
                  placeholder="Kebayoran Baru"
                />
              </div>
              <div className="space-y-2">
                <Label>Kode Pos</Label>
                <Input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="12150"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                ID Kecamatan{" "}
                <span className="text-muted-foreground text-xs">
                  (dari RajaOngkir)
                </span>
              </Label>
              <Input
                name="districtId"
                value={form.districtId}
                onChange={handleChange}
                placeholder="1376"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleCheckOngkir}
              disabled={loadingShipping}
            >
              {loadingShipping ? "Mengecek..." : "Cek Ongkir!"}
            </Button>
          </div>

          {/* Pilih kurir */}
          {shippingOptions.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-medium">Pilih Kurir</h2>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {shippingOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedShipping(opt)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${selectedShipping?.service === opt.service && selectedShipping?.code === opt.code ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{opt.name}</span>
                        <span className="text-muted-foreground ml-2">
                          {opt.service} - {opt.description}
                        </span>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="font-semibold">{opt.cost}</div>
                        <div className="text-muted-foreground text-xs">
                          {opt.etd}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="border rounded-xl p-4 h-fit space-y-3">
          <h2 className="font-semibold">Ringkasan</h2>
          <Separator/>
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{i.name} x{i.quantity}</span>
              <span>{formatRupiah(i.price * i.quantity)}</span>
            </div>
          ))}
          <Separator/>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatRupiah(totalPrice())}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Ongkir</span>
            <span>{selectedShipping ? formatRupiah(selectedShipping.cost) : "-"}</span>
          </div>
          <Separator/>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatRupiah(totalPrice() + (selectedShipping?.cost ?? 0))}</span>
          </div>
          <Button className="w-full" onClick={handleOrder} disabled={!selectedShipping || loadingOrder}>{loadingOrder ? "Memproses..." : "Buat pesanan"}</Button>
        </div>
      </div>
    </div>
  );
}
