import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);

  if (isNaN(productId)) {
    notFound();
  }

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId }, include: { images: true}
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  } 

  return <ProductForm categories={categories} product={product ?? undefined} />;
}
