import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type ProductProps = {
  params: Promise<{ id: string }> | { id: string };
}
export default async function AdminEditProductPage({
  params,
}: ProductProps) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }, include: { images: true }
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });


  if (!product) {
    notFound();
  }
  
  return <ProductForm categories={categories} product={product ?? undefined} />;
}
