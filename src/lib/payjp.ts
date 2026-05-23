const PAYJP_BASE_URL = "https://api.pay.jp/v1";
const PAYJP_PLAN_ID = "premium_monthly_600";

function authHeader(): string {
  return (
    "Basic " +
    Buffer.from(`${process.env.PAYJP_SECRET_KEY}:`).toString("base64")
  );
}

async function payjpFetch<T>(
  method: "GET" | "POST" | "DELETE",
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const headers: HeadersInit = { Authorization: authHeader() };
  let body: string | undefined;
  let url = `${PAYJP_BASE_URL}${path}`;

  if (params) {
    if (method === "GET") {
      url += "?" + new URLSearchParams(params).toString();
    } else {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      body = new URLSearchParams(params).toString();
    }
  }

  const res = await fetch(url, { method, headers, body });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || `PAY.JP error ${res.status}`);
  }

  return json as T;
}

export async function ensurePlan(): Promise<void> {
  try {
    await payjpFetch("GET", `/plans/${PAYJP_PLAN_ID}`);
  } catch {
    await payjpFetch("POST", "/plans", {
      id: PAYJP_PLAN_ID,
      amount: "600",
      currency: "jpy",
      interval: "month",
      name: "自然の恵み プレミアム会員",
    });
  }
}

export async function createCustomer(
  email: string,
  cardToken: string
): Promise<{ id: string }> {
  return payjpFetch("POST", "/customers", { email, card: cardToken });
}

export async function createSubscription(
  customerId: string
): Promise<{ id: string; status: string }> {
  await ensurePlan();
  return payjpFetch("POST", "/subscriptions", {
    customer: customerId,
    plan: PAYJP_PLAN_ID,
  });
}

export async function createCharge(
  customerId: string,
  amount: number,
  description: string
): Promise<{ id: string; paid: boolean }> {
  return payjpFetch("POST", "/charges", {
    customer: customerId,
    amount: String(amount),
    currency: "jpy",
    description,
    capture: "true",
  });
}

export const SHIPPING_FEE = 800;
