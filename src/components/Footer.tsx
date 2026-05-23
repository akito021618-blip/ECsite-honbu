import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-midnight text-cream" role="contentinfo">
      {/* Gold top border */}
      <div className="h-px bg-gold-gradient" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-3xl text-cream tracking-widest">
                自然の恵み
              </span>
              <span className="block text-gold text-xs font-sans tracking-[0.3em] uppercase mt-1">
                Shizen no Megumi
              </span>
            </Link>
            <p className="text-cream/60 text-sm font-sans leading-relaxed mt-4 max-w-xs">
              日本の豊かな自然が育んだ有機食品と、石油系素材を使わないエコな日用品をお届けする会員制オンラインショップです。
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <span className="badge-gold">有機JAS認証</span>
              <span className="badge-gold">エコ包装</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-gold text-xs font-sans font-medium tracking-widest uppercase mb-6">
              ナビゲーション
            </h3>
            <nav aria-label="フッターナビゲーション">
              <ul className="space-y-3">
                {[
                  { href: "/", label: "ホーム" },
                  { href: "/shop", label: "ショップ" },
                  { href: "/subscribe", label: "会員プラン" },
                  { href: "/account", label: "マイページ" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-cream/60 hover:text-gold text-sm font-sans transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Trust & Legal */}
          <div>
            <h3 className="text-gold text-xs font-sans font-medium tracking-widest uppercase mb-6">
              ご利用案内
            </h3>
            <ul className="space-y-3">
              {[
                { label: "特定商取引法に基づく表記" },
                { label: "プライバシーポリシー" },
                { label: "利用規約" },
                { label: "返品・交換について" },
                { label: "お問い合わせ" },
              ].map((item) => (
                <li key={item.label}>
                  <span className="text-cream/60 text-sm font-sans cursor-pointer hover:text-gold transition-colors duration-300">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gold/20 mt-12 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                title: "安全なお支払い",
                desc: "Stripe決済採用",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                title: "送料一律800円",
                desc: "全国対応",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                ),
                title: "有機JAS認証",
                desc: "全商品品質保証",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                  </svg>
                ),
                title: "エコ包装",
                desc: "石油系素材不使用",
              },
            ].map((badge) => (
              <div
                key={badge.title}
                className="flex flex-col items-center text-center p-4 border border-gold/20 hover:border-gold/40 transition-colors duration-300"
              >
                <div className="text-gold mb-3">{badge.icon}</div>
                <span className="text-cream text-sm font-serif font-medium">
                  {badge.title}
                </span>
                <span className="text-cream/50 text-xs font-sans mt-1">
                  {badge.desc}
                </span>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-cream/40 text-xs font-sans tracking-wider">
              &copy; {currentYear} 自然の恵み. All rights reserved.
            </p>
            <p className="text-cream/40 text-xs font-sans tracking-wider">
              月額会員制オーガニックショップ
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
