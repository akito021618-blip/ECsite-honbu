"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="flex items-center space-x-4">
          <label className="label-luxury" htmlFor="quantity">
            数量
          </label>
          <div className="flex items-center border border-gold/30" role="group" aria-label="数量選択">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center text-midnight/60 hover:text-gold hover:bg-gold/5 transition-colors duration-200"
              aria-label="数量を減らす"
              disabled={quantity <= 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1 && val <= product.stock) {
                  setQuantity(val);
                }
              }}
              min={1}
              max={product.stock}
              className="w-14 text-center text-sm font-sans text-midnight border-0 focus:outline-none focus:ring-1 focus:ring-gold/30 bg-transparent"
              aria-label="数量"
            />
            <button
              onClick={() =>
                setQuantity((q) => Math.min(product.stock, q + 1))
              }
              disabled={quantity >= product.stock}
              className="w-10 h-10 flex items-center justify-center text-midnight/60 hover:text-gold hover:bg-gold/5 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="数量を増やす"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || added}
        className={`w-full py-4 text-sm font-sans font-medium tracking-widest uppercase transition-all duration-300 ${
          added
            ? "bg-green-700 text-white cursor-default"
            : isOutOfStock
            ? "bg-midnight/10 text-midnight/30 cursor-not-allowed"
            : "btn-primary"
        }`}
        aria-label={`${product.nameJa}をカートに追加`}
        aria-live="polite"
        aria-atomic="true"
      >
        {added
          ? "カートに追加しました"
          : isOutOfStock
          ? "在庫切れ"
          : "カートに追加する"}
      </button>
    </div>
  );
}
