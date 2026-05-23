"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const formatPrice = (price: number) => `¥${price.toLocaleString("ja-JP")}`;
  const subtotal = getTotalPrice();
  const shippingFee = 800;
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login?callbackUrl=/checkout");
          return;
        }
        if (response.status === 403) {
          router.push("/subscribe");
          return;
        }
        setError(data.error || "チェックアウトに失敗しました");
        return;
      }

      if (data.url) {
        clearCart();
        window.location.href = data.url;
      }
    } catch {
      setError("エラーが発生しました。もう一度お試しください");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gold">
            <svg className="animate-spin w-8 h-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Page Header */}
      <div className="bg-midnight py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl text-cream">ご注文の確認</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-4" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          {[
            { label: "カート", done: true },
            { label: "確認", active: true },
            { label: "お支払い", done: false },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center">
              {i > 0 && (
                <div className={`w-12 h-px mx-2 ${step.done || step.active ? "bg-gold" : "bg-midnight/20"}`} />
              )}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans font-medium ${
                    step.done
                      ? "bg-gold text-midnight"
                      : step.active
                      ? "border-2 border-gold text-gold"
                      : "border border-midnight/20 text-midnight/30"
                  }`}
                  aria-current={step.active ? "step" : undefined}
                >
                  {step.done ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-xs font-sans ${
                    step.active ? "text-gold" : step.done ? "text-midnight" : "text-midnight/30"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Items */}
        <div className="card-luxury mb-6">
          <div className="p-6 border-b border-gold/20">
            <h2 className="font-serif text-xl text-midnight">ご注文商品</h2>
          </div>
          <ul>
            {items.map((item) => (
              <li
                key={item.product.id}
                className="flex items-center space-x-4 p-5 border-b border-gold/10 last:border-0"
              >
                <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-warm-gray">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.nameJa}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-base text-midnight">
                    {item.product.nameJa}
                  </p>
                  <p className="text-midnight/40 text-xs font-sans mt-0.5">
                    数量: {item.quantity}
                  </p>
                </div>
                <span className="font-sans text-sm text-midnight font-medium">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Summary */}
        <div className="card-luxury p-6 mb-6">
          <h2 className="font-serif text-xl text-midnight mb-4">お支払い金額</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-sans">
              <span className="text-midnight/60">商品合計</span>
              <span className="text-midnight">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm font-sans">
              <span className="text-midnight/60">送料</span>
              <span className="text-midnight">{formatPrice(shippingFee)}</span>
            </div>
            <div className="h-px bg-gold/20" />
            <div className="flex justify-between">
              <span className="font-sans font-medium text-midnight text-base">
                合計（税込）
              </span>
              <span className="font-serif text-2xl text-midnight">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="card-luxury p-6 mb-8">
          <h2 className="font-serif text-xl text-midnight mb-4">配送について</h2>
          <div className="space-y-2 text-sm font-sans text-midnight/60">
            <p>送料: 全国一律 ¥800</p>
            <p>配送日数: ご注文確定後 2〜4営業日</p>
            <p>エコパッケージ: 石油系素材不使用の梱包材を使用</p>
          </div>
        </div>

        {error && (
          <div
            className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-sans mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="btn-primary w-full justify-center text-sm"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Stripeへ移動中...</span>
              </span>
            ) : (
              "Stripeでお支払いへ進む"
            )}
          </button>
          <Link
            href="/cart"
            className="btn-secondary w-full justify-center text-xs"
          >
            カートへ戻る
          </Link>
        </div>

        <p className="text-center text-midnight/40 text-xs font-sans mt-4">
          Stripeによる安全な暗号化決済
        </p>
      </div>
    </div>
  );
}
