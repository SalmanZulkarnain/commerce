import Link from "next/link";
import CartBtn from "./CartBtn";
import { auth } from "@/lib/auth";
import { LogoutButton } from "./LogoutBtn";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          My Store
        </Link>

        <CartBtn />

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-600">
                Halo, <strong>{session.user.name}</strong>
              </span>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
