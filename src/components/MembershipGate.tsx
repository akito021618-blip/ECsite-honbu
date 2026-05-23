import Link from "next/link";

interface MembershipGateProps {
  isLoggedIn?: boolean;
}

export function MembershipGate({ isLoggedIn = false }: MembershipGateProps) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Decorative element */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-px w-16 bg-gold" />
          <div className="mx-4 text-gold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-8 h-8"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <div className="h-px w-16 bg-gold" />
        </div>

        <h1 className="font-serif text-4xl text-midnight mb-4">
          会員限定コンテンツ
        </h1>
        <div className="w-12 h-px bg-gold mx-auto mb-6" />

        <p className="text-midnight/60 font-sans text-base leading-relaxed mb-8">
          このページをご覧いただくには、<br />
          プレミアム会員へのご登録が必要です。
        </p>

        {/* Membership Benefits */}
        <div className="bg-white border border-gold/20 p-6 mb-8 text-left">
          <h2 className="font-serif text-xl text-midnight mb-4 text-center">
            会員特典
          </h2>
          <ul className="space-y-3">
            {[
              "厳選有機食品・エコ日用品へのアクセス",
              "月額600円（税込）で全商品購入可能",
              "産地直送・新鮮品質保証",
              "石油系包装材不使用のエコ配送",
              "会員限定の特別価格",
            ].map((benefit) => (
              <li key={benefit} className="flex items-start space-x-3">
                <span className="text-gold mt-0.5 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </span>
                <span className="text-midnight/70 text-sm font-sans">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Display */}
        <div className="bg-midnight text-cream p-6 mb-8">
          <p className="text-cream/60 text-xs font-sans tracking-widest uppercase mb-2">
            月額プラン
          </p>
          <div className="flex items-baseline justify-center space-x-1">
            <span className="font-serif text-5xl text-gold">¥600</span>
            <span className="text-cream/60 font-sans text-sm">/月</span>
          </div>
          <p className="text-cream/40 text-xs font-sans mt-2">
            いつでもキャンセル可能
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isLoggedIn ? (
            <Link href="/subscribe" className="btn-primary">
              会員登録する
            </Link>
          ) : (
            <>
              <Link href="/auth/register" className="btn-primary">
                新規会員登録
              </Link>
              <Link href="/auth/login" className="btn-secondary">
                ログイン
              </Link>
            </>
          )}
        </div>

        <p className="text-midnight/40 text-xs font-sans mt-6">
          Stripeによる安全な決済を採用しています
        </p>
      </div>
    </div>
  );
}
