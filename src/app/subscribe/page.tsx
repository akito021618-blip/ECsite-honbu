"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PayjpCardForm, type PayjpCardFormRef } from "@/components/PayjpCardForm";

export default function SubscribePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const cardFormRef = useRef<PayjpCardFormRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isSubscribed = session?.user?.subscriptionStatus === "active";

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/auth/register");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const token = await cardFormRef.current?.createToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/payjp/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "サブスクリプションの作成に失敗しました");
        return;
      }

      await update();
      router.push("/shop");
    } catch {
      setError("エラーが発生しました。もう一度お試しください");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-20">
        <div className="text-gold">
          <svg className="animate-spin w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-cream pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-green-500 mb-6 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-midnight mb-4">すでに会員です</h1>
          <p className="text-midnight/60 font-sans text-sm mb-8">
            プレミアム会員として全ての商品にアクセスできます。
          </p>
          <Link href="/shop" className="btn-primary">ショップへ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="bg-midnight py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
            Premium Membership
          </span>
          <h1 className="font-serif text-5xl text-cream mt-4 mb-4">プレミアム会員</h1>
          <div className="w-12 h-px bg-gold mx-auto mb-4" />
          <p className="text-cream/50 font-sans text-sm max-w-md mx-auto">
            月額600円で、厳選された有機食品とエコ日用品への無制限アクセスをお楽しみください。
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Benefits */}
          <div>
            <h2 className="font-serif text-3xl text-midnight mb-6">会員特典</h2>
            <div className="gold-divider-left" />
            <ul className="space-y-6 mt-6">
              {[
                {
                  title: "全商品へのアクセス",
                  desc: "厳選された10種類以上の有機食品・エコ日用品を自由にお選びいただけます。",
                },
                {
                  title: "有機JAS認証食品のみ",
                  desc: "農薬・化学肥料不使用の有機JAS認証食品だけを厳選しています。",
                },
                {
                  title: "石油系包装材不使用",
                  desc: "竹・紙など自然由来の素材のみを使用したエコパッケージでお届けします。",
                },
                {
                  title: "いつでもキャンセル可能",
                  desc: "縛りはありません。いつでも簡単にキャンセルできます。",
                },
              ].map((benefit) => (
                <li key={benefit.title} className="flex space-x-4">
                  <div className="text-gold flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-midnight mb-1">{benefit.title}</h3>
                    <p className="text-midnight/60 text-sm font-sans leading-relaxed">{benefit.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscription Card */}
          <div>
            <div className="bg-midnight text-cream p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gold-gradient" />

              <div className="text-center mb-8">
                <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">月額プラン</span>
                <div className="flex items-baseline justify-center space-x-1 mt-4">
                  <span className="font-serif text-6xl text-gold">¥600</span>
                  <span className="text-cream/50 font-sans">/月</span>
                </div>
                <p className="text-cream/40 text-xs font-sans mt-2">いつでもキャンセル可能</p>
              </div>

              <div className="h-px bg-gold/20 mb-6" />

              {session?.user ? (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <PayjpCardForm ref={cardFormRef} />

                  {error && (
                    <div className="p-3 bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-sans" role="alert">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full justify-center mt-2"
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>処理中...</span>
                      </span>
                    ) : (
                      "今すぐ会員登録する — 月額¥600"
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <Link href="/auth/register" className="btn-primary w-full justify-center block text-center">
                    新規会員登録
                  </Link>
                  <Link
                    href="/auth/login?callbackUrl=/subscribe"
                    className="btn-secondary w-full justify-center block text-center border-cream/20 text-cream/70 hover:bg-cream hover:text-midnight"
                  >
                    ログイン
                  </Link>
                </div>
              )}

              <p className="text-center text-cream/30 text-xs font-sans mt-4">
                PAY.JPによる安全な決済
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
