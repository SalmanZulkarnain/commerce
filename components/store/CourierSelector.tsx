"use client"

export interface ShippingOption {
    name: string;
    code: string;
    service: string;
    description: string;
    cost: number;
    etd: string;
}

interface CourierSelectorProps {
    shippingOptions: ShippingOption[];
    selectedShipping: ShippingOption | null;
    onSelectCourier: (option: ShippingOption) => void;
}

export default function CourierSelector({ shippingOptions, onSelectCourier, selectedShipping }: CourierSelectorProps) {
    return (
        <>
            {shippingOptions.length > 0 && (
                <div className="space-y-3">
                    <h2 className="font-medium">Pilih Kurir</h2>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {shippingOptions.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => onSelectCourier(opt)}
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
        </>
    )
}