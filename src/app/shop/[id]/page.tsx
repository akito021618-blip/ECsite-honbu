import { auth } from "@/lib/auth";
import { getProductById, getAllProducts } from "@/lib/products";
import { MembershipGate } from "@/components/MembershipGate";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) return { title: "商品が見つかりません" };
  return {
    title: product.nameJa,
    description: product.description,
  };
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

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user) {
    return <MembershipGate isLoggedIn={false} />;
  }

  if (session.user.subscriptionStatus !== "active") {
    return <MembershipGate isLoggedIn={true} />;
  }

  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => `¥${price.toLocaleString("ja-JP")}`;

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="パンくずリスト">
            <ol className="flex items-center space-x-2 text-xs font-sans text-midnight/40">
              <li>
                <Link href="/" className="hover:text-gold transition-colors duration-200">
                  ホーム
                </Link>
              </li>
              <li aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors duration-200">
                  ショップ
                </Link>
              </li>
              <li aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </li>
              <li className="text-midnight/70" aria-current="page">
                {product.nameJa}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-warm-gray">
              <Image
                src={product.imageUrl}
                alt={product.nameJa}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <span className="badge-gold mb-4">
              {getCategoryLabel(product.category)}
            </span>

            {/* Product Name */}
            <h1 className="font-serif text-4xl md:text-5xl text-midnight leading-tight mb-2">
              {product.nameJa}
            </h1>
            <p className="text-midnight/40 font-sans text-sm tracking-widest uppercase mb-6">
              {product.name}
            </p>

            <div className="gold-divider-left" />

            {/* Price */}
            <div className="flex items-baseline space-x-3 mb-6">
              <span className="font-serif text-4xl text-midnight">
                {formatPrice(product.price)}
              </span>
              <span className="text-midnight/40 text-sm font-sans">（税込）</span>
            </div>

            {/* Description */}
            <p className="text-midnight/70 font-sans text-base leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Stock Info */}
            <div className="flex items-center space-x-3 mb-8">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock === 0
                    ? "bg-red-400"
                    : product.stock <= 3
                    ? "bg-yellow-400"
                    : "bg-green-400"
                }`}
                aria-hidden="true"
              />
              <span className="text-sm font-sans text-midnight/60">
                {product.stock === 0
                  ? "在庫切れ"
                  : `在庫残り ${product.stock}点`}
              </span>
            </div>

            {/* Shipping Info */}
            <div className="bg-warm-gray p-4 mb-8 border border-gold/20">
              <div className="flex items-center space-x-2 text-sm font-sans text-midnight/60">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gold" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span>送料 ¥800（全国一律）</span>
              </div>
            </div>

            {/* Add to Cart */}
            <AddToCartButton product={product} />

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-gold/20">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "有機JAS認証", icon: "✓" },
                  { label: "石油系包装不使用", icon: "✓" },
                  { label: "産地直送", icon: "✓" },
                  { label: "化学肥料不使用", icon: "✓" },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-center space-x-2">
                    <span className="text-gold text-sm font-sans font-medium" aria-hidden="true">
                      {feature.icon}
                    </span>
                    <span className="text-midnight/60 text-xs font-sans">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back to Shop */}
        <div className="mt-16 pt-8 border-t border-gold/20">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-midnight/50 hover:text-gold text-sm font-sans transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>ショップへ戻る</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
