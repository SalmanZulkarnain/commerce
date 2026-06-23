"use client";

import { signOut } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; 
export function LogoutButton() {
  const { clearCart } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // ✅ 1. Clear cart FIRST
      clearCart();
      
      // ✅ 2. Also clear localStorage directly to be safe
      if (typeof window !== "undefined") {
        localStorage.removeItem("my-cart"); // Matches the name in useCart.ts
      }

      // ✅ 3. Sign out
      await signOut({ 
        callbackUrl: "/",
        redirect: true 
      });

      // ✅ 4. Force refresh
      router.refresh();
      
      toast?.success("Berhasil keluar!");
    } catch (error) {
      console.error("Logout error:", error);
      toast?.error("Gagal keluar, coba lagi");
    }
  };

  return (
    <Button variant="ghost" onClick={handleLogout} type="button">
      Keluar
    </Button>
  );
}