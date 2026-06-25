"use client"

import AddressForm from "@/components/store/AddressForm"
import { Address } from "@/types/address";
import { useState } from "react";

const SettingPage = () => {
    const [form, setForm] = useState<Address>({
        userId: "",
        biteshipAreaId: "",
        recepientName: "",
        recepientPhone: "",
        label: "",
        address: "",
        subdistrictName: "",
        districtName: "",
        cityName: "",
        provinceName: "",
        postalCode: ""
    });
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 w-full">
            <AddressForm form={form} setForm={setForm} />
        </div>
    )
}

export default SettingPage