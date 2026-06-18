"use client";

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
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.bankName || !form.accountNumber || !form.amount || !file) {
      alert("Semua field wajib diisi!");
      return;
    }
    setLoading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const obj = await uploadRes.json();

      // Kirim konfirmasi
      const res = await fetch(`/api/payment-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          amount: Number(form.amount),
          transferProof: obj.url,
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
        <Input
          name="bankName"
          value={form.bankName}
          onChange={handleChange}
          placeholder="BCA"
        />
      </div>
      <div className="space-y-2">
        <Label>No. Rekening Pengirim</Label>
        <Input
          name="accountNumber"
          value={form.accountNumber}
          onChange={handleChange}
          placeholder="0987654321"
        />
      </div>
      <div className="space-y-2">
        <Label>Jumlah Transfer</Label>
        <Input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="248000"
        />
      </div>
      <div className="space-y-2">
        <Label>Bukti Transfer</Label>
        <Input
          type="file"
          name="file"
          accept="image"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file && (
          <p className="text-xs text-muted-foreground">{file.name}</p>
        )}
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Mengirim..." : "Konfirmasi Pembayaran"}
      </Button>
    </div>
  );
}
