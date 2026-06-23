"use server";

import { CheckoutFormValues } from "@/types/checkout";

interface OrderItemInput {
    productId: string;
    quantity: number;
}

export default async function createOrderAction(form: CheckoutFormValues, items: OrderItemInput, shippingCost: number, ) {
    if (form.)
}