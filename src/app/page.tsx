import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const session = await auth();
  const isSubscribed = session?.user?.subscriptionStatus === "active";
  const products = await getAllProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center hero-bg overflow-hidden"
        aria-label="ヒーローセクション"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" aria-hidden="true" />
        </div>

        {/* Gold border lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gold/30" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gold/30" aria-hidden="true" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 mb-8">
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
              Premium Organic Shop
            </span>
            <div className="h-px w-8 bg-gold" />
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-cream mb-4 leading-none tracking-tight">
            自然の恵み
          </h1>

          <div className="gold-divider" />

          <p className="font-serif text-xl md:text-2xl text-gold/80 italic mb-6 tracking-wide">
            Shizen no Megumi
          </p>

          <p className="text-cream/60 font-sans text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            日本の豊かな自然が育んだ有機食品と、<br className="hidden md:block" />
            石油系素材を使わないエコな日用品を、産地直送でお届けします。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isSubscribed ? (
              <Link href="/shop" className="btn-primary text-sm">
                ショップを見る
              </Link>
            ) : (
              <>
                <Link href="/auth/register" className="btn-primary text-sm">
                  会員登録する — 月額¥600
                </Link>
                <Link href="/auth/login" className="btn-secondary text-cream border-cream/30 hover:bg-cream hover:text-midnight text-sm">
                  ログイン
                </Link>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-8 mt-12">
            {[
              "有機JAS認証",
              "石油系不使用",
              "産地直送",
            ].map((text, i) => (
              <div key={text} className="flex items-center space-x-2">
                {i > 0 && <div className="h-3 w-px bg-gold/30" />}
                <span className="text-cream/40 text-xs font-sans tracking-widest">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-px h-8 bg-gold/40" />
            <div className="w-1.5 h-1.5 bg-gold/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Subscription Pitch Section */}
      <section
        className="py-24 bg-white"
        aria-label="会員プランの紹介"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
              Membership Plan
            </span>
            <h2 className="section-title mt-4 mb-4">
              プレミアム会員制
            </h2>
            <div className="gold-divider" />
            <p className="text-midnight/60 font-sans text-base leading-relaxed max-w-xl mx-auto">
              月額600円で、厳選された有機食品と環境に優しい日用品へのアクセスを。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "厳選品質",
                desc: "有機JAS認証取得の食品のみを厳選。農薬・化学肥料不使用の安心安全な商品をお届けします。",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ),
              },
              {
                title: "エコ包装",
                desc: "石油系素材を一切使わない、地球にやさしいパッケージング。竹・紙・自然素材のみ使用。",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                ),
              },
              {
                title: "産地直送",
                desc: "日本全国の契約農家から直送。収穫したばかりの新鮮な状態でお届けします。",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-8 border border-gold/20 hover:border-gold/40 transition-all duration-300 group"
              >
                <div className="text-gold mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl text-midnight mb-4">
                  {feature.title}
                </h3>
                <div className="w-8 h-px bg-gold mx-auto mb-4" />
                <p className="text-midnight/60 text-sm font-sans leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Price Card */}
          <div className="max-w-md mx-auto">
            <div className="bg-midnight text-cream p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gold-gradient" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-gold-gradient" />

              <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase mb-4 block">
                月額プラン
              </span>
              <div className="flex items-baseline justify-center space-x-1 mb-4">
                <span className="font-serif text-6xl text-gold">¥600</span>
                <span className="text-cream/50 font-sans">/月</span>
              </div>
              <p className="text-cream/50 text-sm font-sans mb-8">
                いつでもキャンセル可能
              </p>

              {isSubscribed ? (
                <Link href="/shop" className="btn-primary w-full justify-center">
                  ショップへ
                </Link>
              ) : (
                <Link href="/auth/register" className="btn-primary w-full justify-center">
                  今すぐ始める
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section
          className="py-24 bg-cream"
          aria-label="おすすめ商品"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
                Featured Products
              </span>
              <h2 className="section-title mt-4 mb-4">
                人気商品
              </h2>
              <div className="gold-divider" />
              <p className="text-midnight/60 font-sans text-base leading-relaxed">
                厳選された有機食品・エコ日用品の一部をご紹介
              </p>
            </div>

            {isSubscribed ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div className="text-center">
                  <Link href="/shop" className="btn-secondary">
                    全商品を見る
                  </Link>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="card-luxury overflow-hidden">
                    {/* Blurred Product Preview */}
                    <div className="relative aspect-square bg-warm-gray overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src={product.imageUrl}
                          alt="会員限定商品"
                          fill
                          className="object-cover blur-sm opacity-60"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-midnight/20">
                        <div className="text-center">
                          <div className="text-gold mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          </div>
                          <span className="text-cream text-xs font-sans tracking-wider">会員限定</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="h-4 bg-midnight/10 rounded mb-2 w-3/4" />
                      <div className="h-3 bg-midnight/5 rounded mb-3 w-1/2" />
                      <div className="h-3 bg-midnight/5 rounded mb-1 w-full" />
                      <div className="h-3 bg-midnight/5 rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSubscribed && (
              <div className="text-center mt-8">
                <p className="text-midnight/60 font-sans text-sm mb-6">
                  会員登録をすると全商品をご覧いただけます
                </p>
                <Link href="/auth/register" className="btn-primary">
                  会員登録する — 月額¥600
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section
        className="py-24 bg-midnight"
        aria-label="信頼と品質保証"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
              Our Promise
            </span>
            <h2 className="font-serif text-4xl text-cream mt-4 mb-4">
              品質へのこだわり
            </h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "有機JAS認証",
                desc: "全ての食品は有機JAS認証を取得した農家から仕入れています。農薬・化学肥料は一切使用しません。",
              },
              {
                title: "石油系素材不使用",
                desc: "プラスチックなど石油由来の包装材は一切使用せず、竹・紙・自然素材のパッケージングにこだわっています。",
              },
              {
                title: "産地との直接取引",
                desc: "中間業者を通さず、農家・生産者との直接取引により、適正価格と品質を両立しています。",
              },
              {
                title: "フェアトレード推進",
                desc: "生産者の方々が適正な対価を受け取れるよう、フェアトレードの理念に基づいた取引を行っています。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex space-x-4 p-6 border border-gold/20 hover:border-gold/40 transition-all duration-300"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 border border-gold flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gold" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-gold mb-2">{item.title}</h3>
                  <p className="text-cream/50 text-sm font-sans leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 bg-cream text-center"
        aria-label="会員登録への誘導"
      >
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
            Join Us
          </span>
          <h2 className="section-title mt-4 mb-4">
            自然の恵みを、<br />あなたの食卓へ
          </h2>
          <div className="gold-divider" />
          <p className="text-midnight/60 font-sans text-base leading-relaxed mb-10">
            月額600円のプレミアム会員に登録して、<br />
            厳選された有機食品とエコ日用品をお楽しみください。
          </p>
          {!isSubscribed && (
            <Link href="/auth/register" className="btn-primary">
              今すぐ会員登録する
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
