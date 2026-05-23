"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString("ja-JP")}`;
  };

  const isOutOfStock = product.stock === 0;

  return (
    <article className="card-luxury group overflow-hidden">
      <Link href={`/shop/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-warm-gray">
          <Image
            src={product.imageUrl}
            alt={product.nameJa}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-midnight/0 group-hover:bg-midnight/10 transition-all duration-300" />

          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-3 left-3 bg-midnight/80 text-cream text-xs font-sans px-3 py-1 tracking-wider">
              在庫切れ
            </div>
          )}
          {!isOutOfStock && product.stock <= 3 && (
            <div className="absolute top-3 left-3 bg-gold text-midnight text-xs font-sans px-3 py-1 tracking-wider font-medium">
              残り{product.stock}点
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-midnight/60 backdrop-blur-sm text-cream/80 text-xs font-sans px-2 py-1 tracking-wider">
              {getCategoryLabel(product.category)}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Japanese Name */}
          <h3 className="font-serif text-lg text-midnight leading-snug mb-1 group-hover:text-gold transition-colors duration-300">
            {product.nameJa}
          </h3>

          {/* English Name */}
          <p className="text-midnight/50 text-xs font-sans tracking-wider uppercase mb-3">
            {product.name}
          </p>

          {/* Description */}
          <p className="text-midnight/60 text-sm font-sans leading-relaxed mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Price & Stock */}
          <div className="flex items-center justify-between">
            <span className="font-serif text-2xl text-midnight">
              {formatPrice(product.price)}
            </span>
            <span className="text-midnight/40 text-xs font-sans">
              {isOutOfStock ? "在庫切れ" : `在庫 ${product.stock}点`}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      {showAddToCart && (
        <div className="px-5 pb-5">
          <div className="h-px bg-gold/20 mb-4" />
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || added}
            className={`w-full py-3 text-xs font-sans font-medium tracking-widest uppercase transition-all duration-300 ${
              added
                ? "bg-green-700 text-white cursor-default"
                : isOutOfStock
                ? "bg-midnight/10 text-midnight/30 cursor-not-allowed"
                : "btn-primary"
            }`}
            aria-label={`${product.nameJa}をカートに追加`}
          >
            {added ? "カートに追加しました" : isOutOfStock ? "在庫切れ" : "カートに追加"}
          </button>
        </div>
      )}
    </article>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "fermented-foods": "発酵食品",
    fruits: "果物",
    vegetables: "野菜",
    household: "日用品",
    grains: "穀物",
    condiments: "調味料",
    beverages: "飲料",
  };
  return labels[category] || category;
}
