"use client";

import CourierSelector, { ShippingOption } from "@/components/store/CourierSelector";
import CustomerForm from "@/components/store/CustomerForm";
import OrderSummary from "@/components/store/OrderSummary";
import { useCart } from "@/hooks/useCart";
import { CheckoutFormValues, Subdistrict } from "@/types/checkout";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, calculateTotalPrice, totalWeight, clearCart } = useCart();

  const [form, setForm] = useState<CheckoutFormValues>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    subdistrictId: "",
    subdistrictName: "",
    districtName: "",
    cityName: "",
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
    if (!form.subdistrictId) {
      alert("Isi kelurahan dulu");
      return;
    }
    setLoadingShipping(true);
    setSelectedShipping(null);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: form.subdistrictId,
          weight: totalWeight(),
        }),
      });
      const data = await res.json();
      setShippingOptions(data.data ?? []);
    } catch {
      alert("Gagal mengambil data ongkir");
    } finally {
      setLoadingShipping(false);
    }
  };

  const handleSubdistrictSelect = (subdistrict: Subdistrict) => {
    setForm((prev) => ({
      ...prev,
      subdistrictId: String(subdistrict.id),
      districtName: subdistrict.district_name,
      cityName: subdistrict.city_name,
      provinceName: subdistrict.province_name,
      postalCode: subdistrict.zip_code,
    }));
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
          subdistrictId: form.subdistrictId,
          subdistrictName: form.districtName,
          districtName: form.districtName,
          cityName: form.cityName,
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

  const handleOrderAction = async () => {
    
  }

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
          <CustomerForm form={form} loadingShipping={loadingShipping} onChange={handleChange} onCheckOngkir={handleCheckOngkir} onSelectSubdistrict={handleSubdistrictSelect} />

          {/* Pilih kurir */}
          <CourierSelector shippingOptions={shippingOptions} onSelectCourier={setSelectedShipping} selectedShipping={selectedShipping} />
        </div>

        {/* Summary */}
        <OrderSummary items={items} loadingOrder={loadingOrder} selectedShipping={selectedShipping} totalPrice={calculateTotalPrice()} onCreateOrder={handleOrder} checkoutForm={form}/>
      </div>
    </div>
  );
}
