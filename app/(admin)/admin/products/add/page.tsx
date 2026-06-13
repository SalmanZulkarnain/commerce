import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { uploadImage } from "@/lib/cloudinary";

// Fungsi helper buat bikin slug otomatis dari nama produk
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")        // Ganti spasi pake minus
    .replace(/[^\w\-]+/g, "")     // Hapus karakter aneh
    .replace(/\-\-+/g, "-");     // Bersihin minus ganda
}

export default async function AdminAddProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  async function createProductAction(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const categoryIdStr = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const stockStr = formData.get("stock") as string;
    const weightStr = formData.get("weight") as string;
    const file = formData.get("image") as File;
    const url = await uploadImage(file);
    if (!name || !categoryIdStr || !priceStr || !stockStr || !weightStr) return;

    await prisma.product.create({
      data: {
        name,
        slug: `${slugify(name)}-${Date.now()}`, // Ditambah timestamp biar bener-bener unik slug-nya
        categoryId: parseInt(categoryIdStr),
        description: description || "",
        price: parseInt(priceStr),
        stock: parseInt(stockStr),
        weight: parseInt(weightStr),
        isActive: true,
        images: file ? {
          create: [
            {
              imageUrl: url,
              isPrimary: true
            }
          ]
        } : {
          undefined
        }
      },
    });

    redirect("/admin/products");
  }

  return (
    <div className="w-full px-8 py-10 font-sans">
      <form action={createProductAction} className="max-w-3xl mx-auto space-y-6">

        {/* Header Form */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Add New Product</h1>
            <p className="text-xs text-slate-500 mt-0.5">Publish a new item with category and specification mappings.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/products" className="text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50">
              Cancel
            </Link>
            <button type="submit" className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2 shadow-2xs cursor-pointer">
              Save & Publish
            </button>
          </div>
        </div>

        <input type="file" name="image" accept="image/*"/>  

        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Input Nama Produk (Makan 2 kolom) */}
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700 block">Product Name *</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Contoh: Intel Core i5 8400"
                className="w-full text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs placeholder:text-slate-400"
              />
            </div>

            {/* Dropdown Select Category Dinamis dari DB */}
            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-semibold text-slate-700 block">Category *</label>
              <select
                name="categoryId"
                required
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
              rows={4}
              placeholder="Tulis detail spesifikasi produk..."
              className="w-full text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs resize-none placeholder:text-slate-400"
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
                placeholder="602500"
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
                placeholder="1"
                className="w-full text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Input Berat (Gram) - Sesuai Skema Baru */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Weight (Gram) *</label>
              <input
                type="number"
                name="weight"
                required
                min={1}
                placeholder="500"
                className="w-full text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}