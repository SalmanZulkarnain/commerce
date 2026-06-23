"use client"

import { Button } from "../ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

function CartBtn() {
  const { items } = useCart();
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex justify-center items-center font-medium">
            {totalItems}
          </span>
        )}
      </Link>
    </Button>
  );
}

export default CartBtn;
