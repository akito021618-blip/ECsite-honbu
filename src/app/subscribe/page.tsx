"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SubscribePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    if (!session?.user) {
      router.push("/auth/register");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "サブスクリプションの作成に失敗しました");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("エラーが発生しました。もう一度お試しください");
    } finally {
      setIsLoading(false);
    }
  };

  const isSubscribed = session?.user?.subscriptionStatus === "active";

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
          <h1 className="font-serif text-3xl text-midnight mb-4">
            すでに会員です
          </h1>
          <p className="text-midnight/60 font-sans text-sm mb-8">
            プレミアム会員として全ての商品にアクセスできます。
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
      {/* Hero */}
      <div className="bg-midnight py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
            Premium Membership
          </span>
          <h1 className="font-serif text-5xl text-cream mt-4 mb-4">
            プレミアム会員
          </h1>
          <div className="w-12 h-px bg-gold mx-auto mb-4" />
          <p className="text-cream/50 font-sans text-sm max-w-md mx-auto">
            月額600円で、厳選された有機食品とエコ日用品への
            無制限アクセスをお楽しみください。
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Benefits */}
          <div>
            <h2 className="font-serif text-3xl text-midnight mb-6">
              会員特典
            </h2>
            <div className="gold-divider-left" />

            <ul className="space-y-6 mt-6">
              {[
                {
                  title: "全商品へのアクセス",
                  desc: "厳選された10種類以上の有機食品・エコ日用品を自由にお選びいただけます。",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                  ),
                },
                {
                  title: "有機JAS認証食品のみ",
                  desc: "農薬・化学肥料不使用の有機JAS認証食品だけを厳選しています。",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  ),
                },
                {
                  title: "石油系包装材不使用",
                  desc: "竹・紙など自然由来の素材のみを使用したエコパッケージでお届けします。",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  ),
                },
                {
                  title: "いつでもキャンセル可能",
                  desc: "縛りはありません。いつでも簡単にキャンセルできます。",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  ),
                },
              ].map((benefit) => (
                <li key={benefit.title} className="flex space-x-4">
                  <div className="text-gold flex-shrink-0 mt-0.5">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-midnight mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-midnight/60 text-sm font-sans leading-relaxed">
                      {benefit.desc}
                    </p>
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
                <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
                  月額プラン
                </span>
                <div className="flex items-baseline justify-center space-x-1 mt-4">
                  <span className="font-serif text-6xl text-gold">¥600</span>
                  <span className="text-cream/50 font-sans">/月</span>
                </div>
                <p className="text-cream/40 text-xs font-sans mt-2">
                  いつでもキャンセル可能
                </p>
              </div>

              <div className="h-px bg-gold/20 mb-6" />

              <ul className="space-y-3 mb-8">
                {[
                  "全商品への無制限アクセス",
                  "有機JAS認証食品のみ",
                  "石油系包装材不使用",
                  "産地直送・新鮮品質保証",
                  "送料一律¥800",
                ].map((item) => (
                  <li key={item} className="flex items-center space-x-3 text-sm font-sans text-cream/70">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gold flex-shrink-0" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {error && (
                <div
                  className="p-3 bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-sans mb-4"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {session?.user ? (
                <button
                  onClick={handleSubscribe}
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
                      <span>処理中...</span>
                    </span>
                  ) : (
                    "今すぐ会員登録する"
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <Link href="/auth/register" className="btn-primary w-full justify-center block text-center">
                    新規会員登録
                  </Link>
                  <Link href="/auth/login?callbackUrl=/subscribe" className="btn-secondary w-full justify-center block text-center border-cream/20 text-cream/70 hover:bg-cream hover:text-midnight">
                    ログイン
                  </Link>
                </div>
              )}

              <p className="text-center text-cream/30 text-xs font-sans mt-4">
                Stripeによる安全な決済
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
