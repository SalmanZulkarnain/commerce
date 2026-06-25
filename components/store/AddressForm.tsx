"use client"

import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import SubdistrictSearch from './SubdistrictsSearch'
import { Address } from '@/types/address'
import { saveAddress } from '@/actions/address'

interface AddressFormProps {
    form: Address;
    setForm: React.Dispatch<React.SetStateAction<Address>>
}

export default function AddressForm({ form, setForm }: AddressFormProps) {
    const updateField = (key: keyof Address, value: string) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div className='space-y-6'>
            {/* Data diri */}
            <form action={saveAddress}>
                <div className="space-y-3">
                    <h2 className="font-bold text-xl mb-8">Lengkapi Detail Alamat</h2>
                    <div className="space-y-2">
                        <Label>Nama Penerima</Label>
                        <Input
                            name="recepientName"
                            value={form.recepientName}
                            onChange={(e) => updateField("recepientName", e.target.value)}
                            placeholder="Budi Santoso"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Nomor HP</Label>
                        <Input
                            name="recepientPhone"
                            value={form.recepientPhone}
                            onChange={(e) => updateField("recepientPhone", e.target.value)}
                            placeholder="08123456789"
                        />
                    </div>
                </div>

                <Separator />

                {/* Alamat */}
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label>Label Alamat</Label>
                        <Input
                            name="label"
                            value={form.label}
                            onChange={(e) => updateField("label", e.target.value)}
                            placeholder="Rumah"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Alamat Lengkap</Label>
                        <Input
                            name="address"
                            value={form.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            placeholder="Jl. Merdeka No. 10"
                        />
                    </div>
                    <div className="space-y-2">
                        <SubdistrictSearch
                            onSelect={(area) => {
                                setForm((prev) => ({
                                    ...prev,
                                    biteshipAreaId: String(area.id),
                                    subdistrictName: area.administrative_division_level_3_name,
                                    districtName: area.administrative_division_level_3_name,
                                    cityName: area.administrative_division_level_2_name,
                                    provinceName: area.administrative_division_level_1_name,
                                    postalCode: String(area.postal_code),
                                }))
                            }} />
                    </div>
                    <div className="space-y-2">
                        <Label>Kota</Label>
                        <Input
                            name="cityName"
                            value={form.cityName}
                            readOnly
                            placeholder="Jakarta Selatan"
                            className='bg-muted cursor-not-allowed'
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Provinsi</Label>
                        <Input
                            name="provinceName"
                            value={form.provinceName}
                            readOnly
                            placeholder="DKI Jakarta"
                            className='bg-muted cursor-not-allowed'
                        />
                    </div>
                    <Button
                        type='submit'
                        variant="outline"
                        disabled={!form.address}
                    >
                        Simpan
                    </Button>
                </div>
            </form>
        </div>
    )
}