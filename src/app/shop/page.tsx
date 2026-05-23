import { auth } from "@/lib/auth";
import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { MembershipGate } from "@/components/MembershipGate";

export const metadata = {
  title: "ショップ",
  description: "厳選された有機食品とエコ日用品をお買い求めください",
};

const CATEGORIES = [
  { value: "all", label: "すべて" },
  { value: "fruits", label: "果物" },
  { value: "vegetables", label: "野菜" },
  { value: "grains", label: "穀物" },
  { value: "fermented-foods", label: "発酵食品" },
  { value: "beverages", label: "飲料" },
  { value: "condiments", label: "調味料" },
  { value: "household", label: "日用品" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const session = await auth();

  if (!session?.user) {
    return <MembershipGate isLoggedIn={false} />;
  }

  if (session.user.subscriptionStatus !== "active") {
    return <MembershipGate isLoggedIn={true} />;
  }

  const products = await getAllProducts();
  const selectedCategory = searchParams.category || "all";

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Page Header */}
      <div className="bg-midnight py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
            Premium Organic Shop
          </span>
          <h1 className="font-serif text-5xl text-cream mt-4 mb-4">
            ショップ
          </h1>
          <div className="w-12 h-px bg-gold mx-auto mb-4" />
          <p className="text-cream/50 font-sans text-sm max-w-md mx-auto">
            厳選された有機食品と環境に優しい日用品をお届けします
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10" role="navigation" aria-label="カテゴリフィルター">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.value}
              href={cat.value === "all" ? "/shop" : `/shop?category=${cat.value}`}
              className={`px-4 py-2 text-xs font-sans tracking-widest uppercase transition-all duration-300 border ${
                selectedCategory === cat.value
                  ? "bg-midnight text-cream border-midnight"
                  : "bg-white text-midnight/60 border-gold/30 hover:border-gold hover:text-midnight"
              }`}
              aria-current={selectedCategory === cat.value ? "page" : undefined}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Products Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-midnight/50 text-sm font-sans">
            {filteredProducts.length}件の商品
          </p>
          <div className="h-px flex-1 bg-gold/20 mx-4" />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="list"
            aria-label="商品一覧"
          >
            {filteredProducts.map((product) => (
              <div key={product.id} role="listitem">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-midnight/30 mb-2">
              商品が見つかりませんでした
            </p>
            <p className="text-midnight/40 text-sm font-sans">
              別のカテゴリをお試しください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
