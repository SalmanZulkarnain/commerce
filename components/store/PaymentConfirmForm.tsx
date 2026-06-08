"use client";

import { ok } from "assert";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PaymentConfirmForm({ orderId }: { orderId: number }) {
  const router = useRouter();
  const [form, setForm] = useState({
    bankName: "",
    accountNumber: "",
    amount: "",
    transferProof: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (
      !form.bankName ||
      !form.accountNumber ||
      !form.amount ||
      !form.transferProof
    ) {
      alert("Semua field wajib diisi!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/payment-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          amount: Number(form.amount),
          transferProof: form.transferProof,
        }),
      });

      if (!res.ok) throw new Error("Gagal");
      router.refresh();
    } catch {
      alert("Gagal mengirim konfirmasi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
        <div className="space-y-2">
            <Label>Nama Bank</Label>
            <Input name="bankName" value={form.bankName} onChange={handleChange} placeholder="BCA"/>
        </div>
        <div className="space-y-2">
            <Label>No. Rekening Pengirim</Label>
            <Input name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="0987654321"/>
        </div>  
        <div className="space-y-2">
            <Label>Jumlah Transfer</Label>
            <Input name="amount" value={form.amount} onChange={handleChange} placeholder="248000"/>
        </div>  
        <div className="space-y-2">
            <Label>URL Bukti Transfer</Label>
            <Input name="transferProof" value={form.transferProof} onChange={handleChange} placeholder="https://..."/>
        </div>  

        <Button onClick={handleSubmit} disabled={loading} className="w-full">{loading ? "Mengirim..." : "Konfirmasi Pembayaran"}</Button>
    </div>
  )
}
