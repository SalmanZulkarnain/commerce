"use client";

import MapsSearch from "@/components/store/MapsSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import { FormEvent, useState } from "react";

const DynamicMap = dynamic(() => import("@/components/store/Maps"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Address() {
  const [position, setPosition] = useState<[number, number]>([
    -6.175392, 106.827153,
  ]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/biteship/locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("recepientName"),
        contact_name: formData.get("recepientName"),
        contact_phone: formData.get("recepientPhone"),
        address: formData.get("address"),
        note: formData.get("label"),
        postal_code: Number(formData.get("postalCode")),
        latitude: position[0],
        longitude: position[1],
        type: "destination",
      }),
    });

    const rawText = await response.text();
    console.log("Raw output from server:", rawText); // This reveals the culprit!
  };

  return (
    <div className="mx-auto max-w-3xl w-full px-4 py-8 rounded-2xl space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="hidden" name="postalCode" value="12810" />
        {/* Data diri */}
        <div className="space-y-3">
          <h2 className="font-bold text-xl mb-8">Lengkapi Detail Alamat</h2>
          <div className="space-y-2">
            <Label>Nama Penerima</Label>
            <Input name="recepientName" placeholder="Budi Santoso" />
          </div>
          <div className="space-y-2">
            <Label>Nomor HP</Label>
            <Input name="recepientPhone" placeholder="08123456789" />
          </div>
        </div>

        <Separator />

        {/* Alamat */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Kecamatan / Kota / Kode Pos</Label>
            <MapsSearch />
          </div>
          <div className="space-y-2">
            <DynamicMap
              position={position}
              zoom={15}
              onMapClick={(lat, lon) => {
                console.log("Peta diklik di koordinat:", lat, lon);
                setPosition([lat, lon]);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Alamat Lengkap</Label>
            <Input name="address" placeholder="Jl. Merdeka No. 10" />
          </div>
          <div className="space-y-2">
            <Label>Label Alamat</Label>
            <Input name="label" placeholder="Rumah" />
          </div>
          <Button type="submit" variant="outline">
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}
