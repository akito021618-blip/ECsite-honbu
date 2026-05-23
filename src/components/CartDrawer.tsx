"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const formatPrice = (price: number) =>
    `¥${price.toLocaleString("ja-JP")}`;

  const shippingFee = 800;
  const subtotal = getTotalPrice();
  const total = subtotal + shippingFee;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-midnight/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="ショッピングカート"
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-cream shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20 bg-midnight">
          <div>
            <h2 className="font-serif text-xl text-cream">カート</h2>
            <p className="text-cream/50 text-xs font-sans tracking-wider mt-0.5">
              {items.length}点の商品
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-cream/60 hover:text-gold transition-colors duration-300"
            aria-label="カートを閉じる"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="text-gold/30 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-16 h-16"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <p className="font-serif text-xl text-midnight/50 mb-2">
                カートは空です
              </p>
              <p className="text-midnight/40 text-sm font-sans mb-6">
                商品を追加してください
              </p>
              <button
                onClick={onClose}
                className="btn-secondary text-xs"
              >
                ショップへ戻る
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gold/10">
              {items.map((item) => (
                <li key={item.product.id} className="flex items-start space-x-4 p-5">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-warm-gray">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.nameJa}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base text-midnight leading-snug truncate">
                      {item.product.nameJa}
                    </h3>
                    <p className="text-gold font-sans text-sm font-medium mt-1">
                      {formatPrice(item.product.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center border border-gold/30" role="group" aria-label="数量">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-midnight/60 hover:text-gold hover:bg-gold/5 transition-colors duration-200"
                          aria-label="数量を減らす"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                          </svg>
                        </button>
                        <span className="w-8 text-center text-sm font-sans text-midnight" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 flex items-center justify-center text-midnight/60 hover:text-gold hover:bg-gold/5 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="数量を増やす"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-midnight/40 hover:text-red-500 transition-colors duration-200 text-xs font-sans"
                        aria-label={`${item.product.nameJa}を削除`}
                      >
                        削除
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right flex-shrink-0">
                    <span className="font-sans text-sm text-midnight font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gold/20 p-6 bg-white">
            {/* Price Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm font-sans">
                <span className="text-midnight/60">小計</span>
                <span className="text-midnight">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-sans">
                <span className="text-midnight/60">送料</span>
                <span className="text-midnight">{formatPrice(shippingFee)}</span>
              </div>
              <div className="h-px bg-gold/20 my-2" />
              <div className="flex justify-between">
                <span className="font-sans font-medium text-midnight">合計</span>
                <span className="font-serif text-xl text-midnight">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={onClose}
                className="btn-primary w-full justify-center"
              >
                レジに進む
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="btn-secondary w-full justify-center text-xs"
              >
                カートを見る
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
