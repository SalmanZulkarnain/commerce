import { ProductCard } from "@/components/store/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Category } from "@/generated/prisma/client";

async function getProducts(categorySlug?: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug && {
        category: { slug: categorySlug },
      }),
    },
    include: {
      category: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return prisma.category.findMany();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(category),
    getCategories(),
  ]);
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 w-full">
      <h1 className="text-2xl font-semibold mb-6">Semua Produk</h1>
      {/* Filter kategori */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/products"
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            !category
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border hover:bg-muted"
          }`}
        >
          Semua
        </Link>
        {categories.map((cat: Category) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className={`px-3 py-1 rounded-full text-sm border transition-colors ${category === cat.slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>{cat.name}</Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">
          Tidak ada produk di kategori ini
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              category={product.category.name}
              imageUrl={product.images[0]?.imageUrl}
              name={product.name}
              price={product.price}
              slug={product.slug}
              stock={product.stock}
            />
          ))}
        </div>
      )}
    </main>
  );
}
