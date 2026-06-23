import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { SubdistrictSearch } from './SubdistrictsSearch'
import { Button } from '../ui/button'
import { CheckoutFormValues, Subdistrict } from '@/types/checkout'

interface CustomerFormProps {
    form: CheckoutFormValues;
    onSelectSubdistrict: (subdistrict: Subdistrict) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCheckOngkir: () => void;
    loadingShipping: boolean;
}

function CustomerForm({ form, onSelectSubdistrict, onChange, onCheckOngkir, loadingShipping }: CustomerFormProps) {
    return (
        <div className='space-y-6'>
            {/* Data diri */}
            <div className="space-y-3">
                <h2 className="font-medium">Data Penerima</h2>
                <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input
                        name="customerName"
                        value={form.customerName}
                        onChange={onChange}
                        placeholder="Budi Santoso"
                    />
                </div>
                <div className="space-y-2">
                    <Label>No WhatsApp</Label>
                    <Input
                        name="customerPhone"
                        value={form.customerPhone}
                        onChange={onChange}
                        placeholder="08123456789"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Email (opsional)</Label>
                    <Input
                        name="customerEmail"
                        value={form.customerEmail}
                        onChange={onChange}
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
                        onChange={onChange}
                        placeholder="Jl. Merdeka No. 10"
                    />
                </div>
                <div className="space-y-2">
                    <SubdistrictSearch onSelect={onSelectSubdistrict} />
                </div>
                <div className="space-y-2">
                    <Label>Kota</Label>
                    <Input
                        name="cityName"
                        value={form.cityName}
                        readOnly
                        onChange={onChange}
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
                        onChange={onChange}
                        placeholder="DKI Jakarta"
                        className='bg-muted cursor-not-allowed'
                    />
                </div>
                <Button
                    type='button'
                    variant="outline"
                    onClick={onCheckOngkir}
                    disabled={loadingShipping || !form.address || !form.subdistrictId}
                >
                    {loadingShipping ? "Mengecek..." : "Cek Ongkir!"}
                </Button>
            </div>
        </div>
    )
}

export default CustomerForm