import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

// Fungsi helper buat bikin slug otomatis
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

interface EditProductPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  // Await params karena di Next.js terbaru params bertipe Promise
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);

  if (isNaN(productId)) {
    notFound();
  }

  // 1. Ambil data produk lama & daftar kategori secara paralel (biar cepet)
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  // Kalau produk gak ketemu di database, lempar ke halaman 404
  if (!product) {
    notFound();
  }

  // 2. Logical Server Action untuk handle update data
  async function updateProductAction(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const categoryIdStr = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const stockStr = formData.get("stock") as string;
    const weightStr = formData.get("weight") as string;
    const isActiveStr = formData.get("isActive") as string;

    if (!name || !categoryIdStr || !priceStr || !stockStr || !weightStr) return;

    // Update data ke database pake Prisma berdasarkan ID produk
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug: `${slugify(name)}-${productId}`, // Pakai ID biar slug tetep unik tapi gak ganti timestamp terus
        categoryId: parseInt(categoryIdStr),
        description: description || "",
        price: parseInt(priceStr),
        stock: parseInt(stockStr),
        weight: parseInt(weightStr),
        isActive: isActiveStr === "true",
      },
    });

    // Balikin admin ke list produk setelah sukses
    redirect("/admin/products");
  }

  return (
    <div className="w-full px-8 py-10 font-sans">
      <form action={updateProductAction} className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Form */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Edit Product</h1>
            <p className="text-xs text-slate-500 mt-0.5">Modify product details, pricing, stock availability, or status.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/admin/products" 
              className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2 shadow-2xs cursor-pointer"
            >
              Update Product
            </button>
          </div>
        </div>

        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Basic Information
            </h2>
            
            {/* Status Aktif/Arsip Produk */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500">Product Status:</label>
              <select
                name="isActive"
                defaultValue={product.isActive ? "true" : "false"}
                className="text-xs font-bold border border-slate-200 rounded-md px-2.5 py-1 bg-white focus:outline-hidden"
              >
                <option value="true" className="text-emerald-600 font-semibold">Active</option>
                <option value="false" className="text-slate-400 font-semibold">Archived (Hide)</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Input Nama Produk */}
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700 block">Product Name *</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={product.name}
                className="w-full text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Dropdown Select Category */}
            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-semibold text-slate-700 block">Category *</label>
              <select
                name="categoryId"
                required
                defaultValue={product.categoryId}
                className="w-full text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500 shadow-2xs"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Product Description</label>
            <textarea
              name="description"
              rows={5}
              defaultValue={product.description}
              className="w-full text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs resize-none"
            />
          </div>
        </div>

        {/* SECTION 2: SALES & SHIPPING */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs p-6">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-2 mb-4">
            Sales & Shipping Information
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Input Harga */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Price (Rp) *</label>
              <input
                type="number"
                name="price"
                required
                min={0}
                defaultValue={product.price}
                className="w-full text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Input Stok */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Stock *</label>
              <input
                type="number"
                name="stock"
                required
                min={0}
                defaultValue={product.stock}
                className="w-full text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Input Berat */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Weight (Gram) *</label>
              <input
                type="number"
                name="weight"
                required
                min={1}
                defaultValue={product.weight}
                className="w-full text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}