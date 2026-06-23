import { AddToCartButton } from "@/components/store/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { Separator } from "@base-ui/react";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: true,
    },
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const session = await auth();
  if (session) {

  }

  if (!product) notFound();

  const primaryImage =
    product.images.find((i) => i.isPrimary)?.imageUrl ??
    product.images[0].imageUrl ??
    "/placeholder.png";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gambar */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          <Image
            unoptimized
            loading="eager"
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Info produk */}
        <div className="flex flex-col gap-4">
          <Badge variant="secondary" className="w-fit">
            {product.category.name}
          </Badge>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-3xl font-semibold text-primary">
            {formatRupiah(product.price)}
          </p>

          <Separator />

          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="text-sm text-muted-foreground">
            Stok tersedia:{" "}
            <span className="text-foreground font-medium">{product.stock}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Berat:{" "}
            <span className="text-foreground font-medium">
              {product.weight}g
            </span>
          </div>

          <Separator />

          <AddToCartButton
            key={product.id}
            name={product.name}
            imageUrl={product.images[0]?.imageUrl ?? "/placeholder.png"}
            price={product.price}
            productId={product.id}
            weight={product.weight}
            isLoggedIn={!!session}
          />
        </div>
      </div>
    </div>
  );
}
