"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  name: string;
  price: number;
  weight: number;
  imageUrl: string;
  isLoggedIn?: boolean
}

export function AddToCartButton({
  productId,
  name,
  price,
  weight,
  imageUrl,
  isLoggedIn
}: Props) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      const currentPath = window.location.pathname;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`)
      return;
    }

    try {
      addItem({ productId, name, price, weight, imageUrl });
      alert("Berhasil masuk keranjang!")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Button
      size="lg"
      className="w-full cursor-pointer"
      onClick={handleAddToCart}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Tambah ke Keranjang
    </Button>
  );
};

