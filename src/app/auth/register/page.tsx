"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"register" | "subscribe">("register");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    if (formData.password.length < 8) {
      setError("パスワードは8文字以上で設定してください");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "登録に失敗しました");
        return;
      }

      // Auto sign in after registration
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("登録は完了しましたが、ログインに失敗しました。ログインページからお試しください。");
        return;
      }

      setStep("subscribe");
    } catch {
      setError("登録中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("サブスクリプションの作成に失敗しました");
      }
    } catch {
      setError("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipSubscription = () => {
    router.push("/");
  };

  if (step === "subscribe") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="text-green-600 mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gold text-xs font-sans tracking-[0.4em] uppercase">
              Registration Complete
            </span>
            <h1 className="font-serif text-3xl text-midnight mt-3 mb-2">
              登録が完了しました
            </h1>
            <div className="w-12 h-px bg-gold mx-auto mt-4 mb-6" />
            <p className="text-midnight/60 font-sans text-sm leading-relaxed">
              続いて会員サブスクリプションに登録して、
              全商品をお楽しみください。
            </p>
          </div>

          <div className="bg-midnight text-cream p-8 mb-6">
            <div className="absolute top-0 left-0 w-full h-px bg-gold-gradient" />
            <p className="text-gold text-xs font-sans tracking-[0.4em] uppercase mb-3 text-center">
              プレミアム会員プラン
            </p>
            <div className="text-center mb-6">
              <span className="font-serif text-5xl text-gold">¥600</span>
              <span className="text-cream/50 font-sans">/月</span>
            </div>
            <ul className="space-y-2 mb-6">
              {[
                "全商品への無制限アクセス",
                "有機JAS認証食品のみ取り扱い",
                "石油系包装材不使用",
                "産地直送・新鮮品質保証",
                "いつでもキャンセル可能",
              ].map((benefit) => (
                <li key={benefit} className="flex items-center space-x-2 text-sm font-sans text-cream/70">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gold flex-shrink-0" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-sans mb-4" role="alert">
              {error}
            </div>
          )}

          <div className="space-y-3">
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
                "会員登録する — 月額¥600"
              )}
            </button>
            <button
              onClick={handleSkipSubscription}
              className="btn-secondary w-full justify-center text-xs"
            >
              後で登録する
            </button>
          </div>

          <p className="text-midnight/40 text-xs font-sans text-center mt-4">
            Stripeによる安全な決済
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left Panel */}
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
          <div className="space-y-4">
            {[
              "有機JAS認証食品のみ",
              "石油系包装材不使用",
              "産地直送・新鮮品質",
              "いつでもキャンセル可能",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center space-x-3 text-left">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gold flex-shrink-0" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-cream/60 font-sans text-sm">{benefit}</span>
              </div>
            ))}
          </div>
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
              New Member
            </span>
            <h1 className="font-serif text-4xl text-midnight mt-3 mb-2">
              新規会員登録
            </h1>
            <div className="w-12 h-px bg-gold mt-4" />
          </div>

          <form onSubmit={handleRegister} className="space-y-5" noValidate>
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
              <label htmlFor="name" className="label-luxury">
                お名前
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className="input-luxury"
                placeholder="山田 太郎"
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="email" className="label-luxury">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                minLength={8}
                className="input-luxury"
                placeholder="8文字以上"
                aria-required="true"
                aria-describedby="password-hint"
              />
              <p id="password-hint" className="text-midnight/40 text-xs font-sans mt-1">
                8文字以上で設定してください
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label-luxury">
                パスワード（確認）
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="input-luxury"
                placeholder="••••••••"
                aria-required="true"
              />
            </div>

            <button
              type="submit"
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
                  <span>登録中...</span>
                </span>
              ) : (
                "アカウントを作成する"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-midnight/50 text-sm font-sans">
              すでにアカウントをお持ちの方は{" "}
              <Link
                href="/auth/login"
                className="text-gold hover:text-gold-dark transition-colors duration-200 font-medium"
              >
                ログイン
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
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
