import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

interface Props {
    id: string; 
    name: string;
    slug: string;
    price: number; 
    stock: number;
    imageUrl: string;
    category: string;
}

export function ProductCard({ name, slug, price, stock, imageUrl, category}: Props) {
    return (
        <Link href={`/products/${slug}`}>
            <div className="group rounded-xl border border-border bg-card hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    unoptimized
                    loading="eager"
                    sizes="30"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <div className="p-3 space-y-1">
                    <Badge variant="secondary" className="text-xs">{category}</Badge>
                    <h3 className="font-medium text-sm leading-tight line-clamp-2">{name}</h3>
                    <p className="font-semibold text-primary">{formatRupiah(price)}</p>
                    <p className="text-xs text-muted-foreground">Stock: {stock}</p>
                </div>
            </div>
        </Link>
    )
}
