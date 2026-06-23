"use client"

import { Separator } from '../ui/separator'
import { formatRupiah } from '@/lib/utils'
import { ShippingOption } from './CourierSelector'
import { Button } from '../ui/button';
import { CartItem } from '@/hooks/useCart';
import { CheckoutFormValues } from '@/types/checkout';

interface OrderSummaryProps {
    items: CartItem[];
    totalPrice: number;
    selectedShipping: ShippingOption | null;
    onCreateOrder: () => void;
    loadingOrder: boolean;
    checkoutForm: CheckoutFormValues;
}

function OrderSummary({ items, totalPrice, selectedShipping, onCreateOrder, loadingOrder, checkoutForm }: OrderSummaryProps) {

    const isFormInvalid =
        !checkoutForm.customerName.trim() ||
        !checkoutForm.customerPhone.trim() ||
        !checkoutForm.address.trim() ||
        !checkoutForm.subdistrictId;
    return (
        <div className="border rounded-xl p-4 h-fit space-y-3">
            <h2 className="font-semibold">Ringkasan</h2>
            <Separator />
            {items.map((i) => (
                <div key={i.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                        {i.name} x{i.quantity}
                    </span>
                    <span>{formatRupiah(i.price * i.quantity)}</span>
                </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatRupiah(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ongkir</span>
                <span>
                    {selectedShipping ? formatRupiah(selectedShipping.cost) : "-"}
                </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>
                    {formatRupiah(totalPrice + (selectedShipping?.cost ?? 0))}
                </span>
            </div>
            <Button
                className="w-full"
                onClick={onCreateOrder}
                disabled={!selectedShipping || loadingOrder || isFormInvalid}
            >
                {loadingOrder ? "Memproses..." : "Buat pesanan"}
            </Button>
        </div>
    )
}

export default OrderSummary