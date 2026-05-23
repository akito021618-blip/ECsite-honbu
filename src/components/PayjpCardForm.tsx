"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

interface PayjpElement {
  mount: (selector: string) => void;
  unmount: () => void;
}

interface PayjpInstance {
  elements: () => {
    create: (type: string, options?: Record<string, unknown>) => PayjpElement;
  };
  createToken: (
    element: PayjpElement
  ) => Promise<{ token?: { id: string }; error?: { message: string } }>;
}

export interface PayjpCardFormRef {
  createToken: () => Promise<string | null>;
}

export const PayjpCardForm = forwardRef<PayjpCardFormRef>((_, ref) => {
  const payjpRef = useRef<PayjpInstance | null>(null);
  const cardNumberRef = useRef<PayjpElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.pay.jp/v2/pay.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const win = window as Window & { Payjp?: (key: string) => PayjpInstance };
    if (!win.Payjp) return;

    const payjp = win.Payjp(process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY ?? "");
    const elements = payjp.elements();

    const baseStyle = {
      base: {
        color: "#0F0F1A",
        fontFamily: "system-ui, sans-serif",
        fontSize: "14px",
        "::placeholder": { color: "rgba(15,15,26,0.3)" },
      },
    };

    const number = elements.create("cardNumber", { style: baseStyle });
    const expiry = elements.create("cardExpiry", { style: baseStyle });
    const cvc = elements.create("cardCvc", { style: baseStyle });

    number.mount("#payjp-card-number");
    expiry.mount("#payjp-card-expiry");
    cvc.mount("#payjp-card-cvc");

    payjpRef.current = payjp;
    cardNumberRef.current = number;

    return () => {
      number.unmount();
      expiry.unmount();
      cvc.unmount();
    };
  }, [loaded]);

  useImperativeHandle(ref, () => ({
    async createToken() {
      if (!payjpRef.current || !cardNumberRef.current) return null;
      setFieldError("");
      const { token, error } = await payjpRef.current.createToken(
        cardNumberRef.current
      );
      if (error) {
        setFieldError(error.message);
        return null;
      }
      return token?.id ?? null;
    },
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="label-luxury">カード番号</label>
        <div
          id="payjp-card-number"
          className="input-luxury flex items-center"
          style={{ minHeight: "42px" }}
          aria-label="カード番号"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-luxury">有効期限</label>
          <div
            id="payjp-card-expiry"
            className="input-luxury flex items-center"
            style={{ minHeight: "42px" }}
            aria-label="有効期限"
          />
        </div>
        <div>
          <label className="label-luxury">セキュリティコード</label>
          <div
            id="payjp-card-cvc"
            className="input-luxury flex items-center"
            style={{ minHeight: "42px" }}
            aria-label="セキュリティコード"
          />
        </div>
      </div>

      {!loaded && (
        <p className="text-midnight/40 text-xs font-sans">
          決済フォームを読み込み中...
        </p>
      )}

      {fieldError && (
        <div
          className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans"
          role="alert"
        >
          {fieldError}
        </div>
      )}
    </div>
  );
});

PayjpCardForm.displayName = "PayjpCardForm";
