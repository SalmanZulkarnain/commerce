"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";


export function Navbar() {
    const { items} = useCart();
    const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link href="/" className="font-bold text-lg">Hannan Store</Link>

                <Button variant="ghost" size="icon" className="relative">
                    <Link href="/cart">
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex justify-center items-center font-medium">{totalItems}</span>
                        )}
                    </Link>
                </Button>
            </div>
        </header>
    )
}