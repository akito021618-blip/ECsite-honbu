import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const SUBSCRIPTION_PRICE = 600; // ¥600/month
export const SHIPPING_FEE = 800; // ¥800 flat shipping
