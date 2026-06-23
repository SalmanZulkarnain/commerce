import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/ProductCard";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { HomePageClient } from "./HomePageClient";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

export default async function HomePage() {
  const products = await getFeaturedProducts();
  const session = await auth();
  // Log for debugging (only shows in terminal)
  console.log("🔐 Server Session:", session ? "Authenticated" : "Unauthenticated");
  console.log("👤 User:", session?.user?.name || "No user");

  return (
    <>
      {/* Hero */}
      <section className="bg-linear-to-br from-primary/10 to-background border-b">
        <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl font-bold tracking-tight">My Store</h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Peralatan olahraga, hobi, dan perlengkapan rumah berkualitas.
            Pengiriman ke seluruh Indonesia.
          </p>
          <Button size="lg">
            <Link href="/products">Lihat Semua Produk</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Produk Terbaru</h2>
          <Link
            href="/products"
            className="text-sm text-primary hover:underline"
          >
            Lihat semua →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              category={product.category.name}
              imageUrl={product.images[0]?.imageUrl ?? "/placeholder.png"}
              name={product.name}
              price={product.price}
              slug={product.slug}
              stock={product.stock}
            />
          ))}
        </div>
      </section>
      <HomePageClient initialSession={session} />
    </>
  );
}
