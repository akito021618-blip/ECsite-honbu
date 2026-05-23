"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { CartDrawer } from "@/components/CartDrawer";

export function Header() {
  const { data: session } = useSession();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setTotalItems(getTotalItems());
  }, [getTotalItems]);

  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state) => {
      setTotalItems(state.getTotalItems());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSubscribed = session?.user?.subscriptionStatus === "active";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-midnight/95 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-serif text-2xl text-cream tracking-widest group-hover:text-gold transition-colors duration-300">
                自然の恵み
              </span>
              <span className="text-gold text-xs font-sans tracking-[0.3em] uppercase">
                Shizen no Megumi
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" aria-label="メインナビゲーション">
              <Link
                href="/"
                className="text-cream/80 hover:text-gold text-sm font-sans tracking-widest uppercase transition-colors duration-300"
              >
                ホーム
              </Link>
              {isSubscribed ? (
                <Link
                  href="/shop"
                  className="text-cream/80 hover:text-gold text-sm font-sans tracking-widest uppercase transition-colors duration-300"
                >
                  ショップ
                </Link>
              ) : (
                <Link
                  href="/subscribe"
                  className="text-cream/80 hover:text-gold text-sm font-sans tracking-widest uppercase transition-colors duration-300"
                >
                  会員登録
                </Link>
              )}
              {session?.user && (
                <Link
                  href="/account"
                  className="text-cream/80 hover:text-gold text-sm font-sans tracking-widest uppercase transition-colors duration-300"
                >
                  マイページ
                </Link>
              )}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              {isSubscribed && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-cream/80 hover:text-gold transition-colors duration-300"
                  aria-label={`カート (${totalItems}点)`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-midnight text-xs w-5 h-5 rounded-full flex items-center justify-center font-sans font-medium">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </button>
              )}

              {/* Auth Buttons */}
              {session?.user ? (
                <div className="hidden md:flex items-center space-x-3">
                  <span className="text-cream/60 text-sm font-sans">
                    {session.user.name || session.user.email}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-cream/60 hover:text-gold text-sm font-sans tracking-wider transition-colors duration-300"
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link
                    href="/auth/login"
                    className="text-cream/80 hover:text-gold text-sm font-sans tracking-widest uppercase transition-colors duration-300"
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-primary py-2 px-5 text-xs"
                  >
                    会員登録
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-cream/80 hover:text-gold transition-colors duration-300"
                aria-label="メニューを開く"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gold/20 py-4 animate-fade-in">
              <nav className="flex flex-col space-y-4" aria-label="モバイルナビゲーション">
                <Link
                  href="/"
                  className="text-cream/80 hover:text-gold text-sm font-sans tracking-widest uppercase transition-colors duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ホーム
                </Link>
                {isSubscribed ? (
                  <Link
                    href="/shop"
                    className="text-cream/80 hover:text-gold text-sm font-sans tracking-widest uppercase transition-colors duration-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ショップ
                  </Link>
                ) : (
                  <Link
                    href="/subscribe"
                    className="text-cream/80 hover:text-gold text-sm font-sans tracking-widest uppercase transition-colors duration-300 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    会員登録
                  </Link>
                )}
                {session?.user ? (
                  <>
                    <Link
                      href="/account"
                      className="text-cream/80 hover:text-gold text-sm font-sans tracking-widest uppercase transition-colors duration-300 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      マイページ
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="text-left text-cream/60 hover:text-gold text-sm font-sans tracking-widest uppercase transition-colors duration-300 py-2"
                    >
                      ログアウト
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-cream/80 hover:text-gold text-sm font-sans tracking-widest uppercase transition-colors duration-300 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                    <Link
                      href="/auth/register"
                      className="btn-primary py-2 px-5 text-xs w-fit"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      会員登録
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
