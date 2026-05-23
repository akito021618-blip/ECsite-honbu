"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("ログイン中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left Panel - Design */}
      <div className="hidden lg:flex lg:w-1/2 hero-bg items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-12">
          <Link href="/">
            <span className="font-serif text-5xl text-cream tracking-widest block">
              自然の恵み
            </span>
            <span className="text-gold text-sm font-sans tracking-[0.4em] uppercase block mt-2">
              Shizen no Megumi
            </span>
          </Link>
          <div className="w-16 h-px bg-gold mx-auto my-8" />
          <p className="text-cream/50 font-sans text-sm leading-relaxed max-w-xs">
            日本の豊かな自然が育んだ<br />
            有機食品をお届けする<br />
            プレミアム会員制ショップ
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/">
              <span className="font-serif text-3xl text-midnight tracking-widest">
                自然の恵み
              </span>
            </Link>
          </div>

          <div className="mb-10">
            <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
              Member Login
            </span>
            <h1 className="font-serif text-4xl text-midnight mt-3 mb-2">
              ログイン
            </h1>
            <div className="w-12 h-px bg-gold mt-4" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {error && (
              <div
                className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-sans"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="label-luxury">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="input-luxury"
                placeholder="your@email.com"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-luxury">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="input-luxury"
                placeholder="••••••••"
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center relative"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>ログイン中...</span>
                </span>
              ) : (
                "ログイン"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-midnight/50 text-sm font-sans">
              アカウントをお持ちでない方は{" "}
              <Link
                href="/auth/register"
                className="text-gold hover:text-gold-dark transition-colors duration-200 font-medium"
              >
                新規会員登録
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-midnight/40 hover:text-gold text-xs font-sans transition-colors duration-200"
            >
              トップページへ戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-gold">
          <svg className="animate-spin w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
