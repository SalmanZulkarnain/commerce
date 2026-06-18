"use client";

import Link from "next/link";
import { Category } from "@/generated/prisma/client";
import {
  ProductFormState,
  ProductImageState,
  ProductWithImages,
} from "@/app/(admin)/admin/products/types";
import saveProductAction from "@/app/(admin)/admin/products/actions";
import ImageUpload from "./ImageUpload";
import { useTransition } from "react";
import { useActionState, useState } from "react";

type ProductFormProps = {
  categories: Category[];
  product?: ProductWithImages;
};

const initialState: ProductFormState = {
  errors: null,
};  

export default function ProductForm({ categories, product }: ProductFormProps) {
  const [state, formAction] = useActionState(saveProductAction, initialState);
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<ProductImageState[]>(() => {
    if (product?.images) {
      return product.images.map(img => ({
        type: "existing", 
        id: img.id,
        imageUrl: img.imageUrl, 
        publicId: img.publicId,
        isPrimary: img.isPrimary 
      }))
    }
    return [];
  });

  
  const handleSubmitForm = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const currentImages = images;
    
    startTransition(() => {
      formAction({
        formData,
        currentImages,
      });
    });
  }

  return (
    <div className="w-full px-8 py-10 font-sans">
      <form
        onSubmit={handleSubmitForm}
        className="max-w-3xl mx-auto space-y-6"
      >
        {product?.id && <input type="hidden" name="id" value={product.id} />}

        {/* Header Form */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {product ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {product ? "Publish an edited item with category and specification mappings." : "Publish a new item with category and specification mappings."}
            </p>
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
              Save & Publish
            </button>
          </div>
        </div>

        <ImageUpload images={images} setImages={setImages} maxImages={9} />

        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-xs p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Input Nama Produk (Makan 2 kolom) */}
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={product?.name}
                required
                placeholder="Contoh: Intel Core i5 8400"
                className="w-full text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs placeholder:text-slate-400"
              />
              {state.errors?.fieldErrors.name && (
                <p className="text-red-500 text-xs">
                  {state.errors.fieldErrors.name[0]}
                </p>
              )}
            </div>

            {/* Dropdown Select Category Dinamis dari DB */}
            <div className="space-y-1.5 col-span-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Category *
              </label>
              <select
                name="categoryId"
                required
                defaultValue={product?.categoryId}
                className="w-full text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-blue-500 shadow-2xs"
              >
                <option>Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {state.errors?.fieldErrors.categoryId && (
                <p className="text-red-500 text-xs">
                  {state.errors.fieldErrors.categoryId[0]}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Product Description *
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description}
              placeholder="Tulis detail spesifikasi produk..."
              className="w-full text-sm font-medium text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs resize-none placeholder:text-slate-400"
            />
            {state.errors?.fieldErrors.description && (
              <p className="text-red-500 text-xs">
                {state.errors.fieldErrors.description[0]}
              </p>
            )}
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
              <label className="text-xs font-semibold text-slate-700 block">
                Price (Rp) *
              </label>
              <input
                type="number"
                name="price"
                required
                defaultValue={product?.price}
                min={0}
                placeholder="602500"
                className="w-full text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
              {state.errors?.fieldErrors.price && (
                <p className="text-red-500 text-xs">
                  {state.errors.fieldErrors.price[0]}
                </p>
              )}
            </div>

            {/* Input Stok */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                required
                defaultValue={product?.stock}
                min={0}
                placeholder="1"
                className="w-full text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
              {state.errors?.fieldErrors.stock && (
                <p className="text-red-500 text-xs">
                  {state.errors.fieldErrors.stock[0]}
                </p>
              )}
            </div>

            {/* Input Berat (Gram) - Sesuai Skema Baru */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Weight (Gram) *
              </label>
              <input
                type="number"
                name="weight"
                defaultValue={product?.weight}
                required
                min={1}
                placeholder="500"
                className="w-full text-sm font-semibold text-slate-800 border border-slate-200 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-blue-500 shadow-2xs"
              />
              {state.errors?.fieldErrors.weight && (
                <p className="text-red-500 text-xs">
                  {state.errors.fieldErrors.weight[0]}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
