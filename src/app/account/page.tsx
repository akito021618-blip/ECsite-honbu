import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "マイページ",
  description: "アカウント情報とご注文履歴の確認",
};

async function getOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "処理中",
    paid: "支払い完了",
    shipped: "配送中",
    delivered: "お届け済み",
    cancelled: "キャンセル",
  };
  return labels[status] || status;
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { subscription?: string; order?: string; orderId?: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/account");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const orders = await getOrders(user.id);
  const formatPrice = (price: number) => `¥${price.toLocaleString("ja-JP")}`;
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const isSubscribed = user.subscriptionStatus === "active";
  const showSubscriptionSuccess = searchParams.subscription === "success";
  const showOrderSuccess = searchParams.order === "success";

  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Page Header */}
      <div className="bg-midnight py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
            My Account
          </span>
          <h1 className="font-serif text-4xl text-cream mt-3">マイページ</h1>
          <div className="w-12 h-px bg-gold mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Notifications */}
        {showSubscriptionSuccess && (
          <div
            className="p-4 bg-green-50 border border-green-200 text-green-700 font-sans text-sm mb-8"
            role="alert"
            aria-live="polite"
          >
            会員登録が完了しました。ショップへのアクセスが解放されました。
          </div>
        )}
        {showOrderSuccess && (
          <div
            className="p-4 bg-green-50 border border-green-200 text-green-700 font-sans text-sm mb-8"
            role="alert"
            aria-live="polite"
          >
            ご注文が完了しました。ありがとうございます。
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="card-luxury p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-midnight flex items-center justify-center border border-gold/30">
                  <span className="font-serif text-2xl text-gold">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-serif text-lg text-midnight">
                    {user.name || "会員"}
                  </p>
                  <p className="text-midnight/50 text-xs font-sans">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="h-px bg-gold/20 mb-4" />
              <div className="text-xs font-sans text-midnight/50">
                <p>登録日: {formatDate(user.createdAt)}</p>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="card-luxury p-6">
              <h2 className="font-serif text-lg text-midnight mb-4">
                サブスクリプション
              </h2>
              <div className="h-px bg-gold/20 mb-4" />

              {isSubscribed ? (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full" aria-hidden="true" />
                    <span className="text-sm font-sans text-green-600 font-medium">
                      有効
                    </span>
                  </div>
                  <p className="text-midnight/50 text-xs font-sans mb-1">
                    プレミアム会員
                  </p>
                  <p className="text-midnight/50 text-xs font-sans">
                    月額 ¥600
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-red-400 rounded-full" aria-hidden="true" />
                    <span className="text-sm font-sans text-red-600 font-medium">
                      {user.subscriptionStatus === "past_due" ? "支払い失敗" : "未加入"}
                    </span>
                  </div>
                  <Link href="/subscribe" className="btn-primary text-xs py-2 px-4">
                    会員登録する
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="card-luxury p-6">
              <h2 className="font-serif text-lg text-midnight mb-4">
                クイックリンク
              </h2>
              <div className="h-px bg-gold/20 mb-4" />
              <nav aria-label="マイページナビゲーション">
                <ul className="space-y-2">
                  {isSubscribed && (
                    <li>
                      <Link
                        href="/shop"
                        className="flex items-center space-x-2 text-sm font-sans text-midnight/60 hover:text-gold transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                        </svg>
                        <span>ショップへ</span>
                      </Link>
                    </li>
                  )}
                  {isSubscribed && (
                    <li>
                      <Link
                        href="/cart"
                        className="flex items-center space-x-2 text-sm font-sans text-midnight/60 hover:text-gold transition-colors duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                        </svg>
                        <span>カートを見る</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content - Orders */}
          <div className="lg:col-span-2">
            <div className="card-luxury">
              <div className="p-6 border-b border-gold/20">
                <h2 className="font-serif text-2xl text-midnight">
                  ご注文履歴
                </h2>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-gold/30 mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </div>
                  <p className="font-serif text-xl text-midnight/40 mb-2">
                    注文履歴はありません
                  </p>
                  <p className="text-midnight/30 text-sm font-sans mb-6">
                    ショップで商品をお選びください
                  </p>
                  {isSubscribed && (
                    <Link href="/shop" className="btn-secondary text-xs">
                      ショップへ
                    </Link>
                  )}
                </div>
              ) : (
                <ul className="divide-y divide-gold/10" aria-label="注文一覧">
                  {orders.map((order) => (
                    <li key={order.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xs font-sans text-midnight/40 mb-1">
                            注文ID: {order.id.slice(0, 8)}...
                          </p>
                          <p className="text-sm font-sans text-midnight/60">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-sans px-2 py-1 ${getStatusColor(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 mb-4">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm font-sans"
                          >
                            <span className="text-midnight/70">
                              {item.product.nameJa} × {item.quantity}
                            </span>
                            <span className="text-midnight">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="h-px bg-gold/20 mb-4" />

                      <div className="flex items-center justify-between">
                        <div className="space-y-1 text-xs font-sans text-midnight/50">
                          <p>送料: {formatPrice(order.shippingFee)}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-sans text-midnight/50">合計</span>
                          <p className="font-serif text-xl text-midnight">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
