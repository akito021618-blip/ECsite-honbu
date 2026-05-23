"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { PayjpCardForm, type PayjpCardFormRef } from "@/components/PayjpCardForm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const cardFormRef = useRef<PayjpCardFormRef>(null);
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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setError("");
    setIsLoading(true);

    try {
      const token = await cardFormRef.current?.createToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/payjp/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, items }),
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

      clearCart();
      router.push(`/account?order=success&orderId=${data.orderId}`);
    } catch {
      setError("エラーが発生しました。もう一度お試しください");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
        <div className="text-gold">
          <svg className="animate-spin w-8 h-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Page Header */}
      <div className="bg-midnight py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl text-cream">ご注文・お支払い</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-4" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          {[
            { label: "カート", done: true },
            { label: "お支払い", active: true },
            { label: "完了", done: false },
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
                <span className={`text-xs font-sans ${step.active ? "text-gold" : step.done ? "text-midnight" : "text-midnight/30"}`}>
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Card Form */}
            <div className="space-y-6">
              {/* Card Payment */}
              <div className="card-luxury p-6">
                <h2 className="font-serif text-xl text-midnight mb-2">カード情報</h2>
                <div className="h-px bg-gold/20 mb-6" />
                <PayjpCardForm ref={cardFormRef} />
              </div>

              {/* Shipping Info */}
              <div className="card-luxury p-6">
                <h2 className="font-serif text-xl text-midnight mb-4">配送について</h2>
                <div className="space-y-2 text-sm font-sans text-midnight/60">
                  <p>送料: 全国一律 ¥800</p>
                  <p>配送日数: ご注文確定後 2〜4営業日</p>
                  <p>エコパッケージ: 石油系素材不使用の梱包材を使用</p>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="space-y-6">
              {/* Order Items */}
              <div className="card-luxury">
                <div className="p-6 border-b border-gold/20">
                  <h2 className="font-serif text-xl text-midnight">ご注文商品</h2>
                </div>
                <ul>
                  {items.map((item) => (
                    <li key={item.product.id} className="flex items-center space-x-4 p-5 border-b border-gold/10 last:border-0">
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
                        <p className="font-serif text-base text-midnight">{item.product.nameJa}</p>
                        <p className="text-midnight/40 text-xs font-sans mt-0.5">数量: {item.quantity}</p>
                      </div>
                      <span className="font-sans text-sm text-midnight font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Summary */}
              <div className="card-luxury p-6">
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
                    <span className="font-sans font-medium text-midnight">合計（税込）</span>
                    <span className="font-serif text-2xl text-midnight">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-sans" role="alert">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full justify-center"
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>決済処理中...</span>
                    </span>
                  ) : (
                    `${formatPrice(total)} をお支払い`
                  )}
                </button>
                <Link href="/cart" className="btn-secondary w-full justify-center text-xs">
                  カートへ戻る
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-2 text-midnight/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className="text-xs font-sans">PAY.JPによる安全な暗号化決済</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
