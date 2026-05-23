"use client";

import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const formatPrice = (price: number) => `¥${price.toLocaleString("ja-JP")}`;
  const subtotal = getTotalPrice();
  const shippingFee = 800;
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-gold/30 mb-6 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-midnight mb-4">
            カートは空です
          </h1>
          <p className="text-midnight/50 font-sans text-sm mb-8">
            商品をカートに追加してください
          </p>
          <Link href="/shop" className="btn-primary">
            ショップへ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Page Header */}
      <div className="bg-midnight py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl text-cream">カート</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl text-midnight mb-6">
              ご注文商品 ({items.length}点)
            </h2>

            <ul className="space-y-4" aria-label="カート内商品">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="card-luxury p-5 flex items-start space-x-5"
                >
                  {/* Product Image */}
                  <Link
                    href={`/shop/${item.product.id}`}
                    className="flex-shrink-0"
                  >
                    <div className="relative w-24 h-24 overflow-hidden bg-warm-gray">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.nameJa}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="96px"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.product.id}`}>
                      <h3 className="font-serif text-lg text-midnight hover:text-gold transition-colors duration-300">
                        {item.product.nameJa}
                      </h3>
                    </Link>
                    <p className="text-midnight/40 text-xs font-sans tracking-widest uppercase mt-0.5 mb-3">
                      {item.product.name}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gold/30" role="group" aria-label={`${item.product.nameJa}の数量`}>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-9 h-9 flex items-center justify-center text-midnight/60 hover:text-gold hover:bg-gold/5 transition-colors duration-200"
                          aria-label="数量を減らす"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                          </svg>
                        </button>
                        <span className="w-10 text-center text-sm font-sans text-midnight" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="w-9 h-9 flex items-center justify-center text-midnight/60 hover:text-gold hover:bg-gold/5 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="数量を増やす"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-serif text-xl text-midnight">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="mt-2 text-midnight/30 hover:text-red-500 text-xs font-sans transition-colors duration-200"
                      aria-label={`${item.product.nameJa}を削除`}
                    >
                      削除する
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 text-midnight/50 hover:text-gold text-sm font-sans transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span>ショッピングを続ける</span>
              </Link>

              <button
                onClick={clearCart}
                className="text-midnight/30 hover:text-red-500 text-xs font-sans transition-colors duration-200"
              >
                カートを空にする
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-luxury p-6 sticky top-24">
              <h2 className="font-serif text-2xl text-midnight mb-6">
                注文概要
              </h2>
              <div className="h-px bg-gold/20 mb-6" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-midnight/60">小計</span>
                  <span className="text-midnight">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-midnight/60">送料</span>
                  <span className="text-midnight">{formatPrice(shippingFee)}</span>
                </div>
                <div className="h-px bg-gold/20" />
                <div className="flex justify-between">
                  <span className="font-sans font-medium text-midnight">
                    合計（税込）
                  </span>
                  <span className="font-serif text-2xl text-midnight">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full justify-center mb-3"
              >
                レジに進む
              </button>

              <p className="text-center text-midnight/40 text-xs font-sans">
                PAY.JPによる安全な決済
              </p>

              {/* Security badges */}
              <div className="mt-4 pt-4 border-t border-gold/20">
                <div className="flex items-center justify-center space-x-2 text-midnight/30">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-xs font-sans">SSL暗号化通信</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
