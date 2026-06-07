"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

interface Props {
  productId: number;
  name: string;
  price: number;
  weight: number;
  imageUrl: string;
}

export function AddToCartButton({
  productId,
  name,
  price,
  weight,
  imageUrl,
}: Props) {
  const { addItem } = useCart();

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={() => addItem({ productId, name, price, weight, imageUrl })}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Tambah ke Keranjang
    </Button>
  );
}
