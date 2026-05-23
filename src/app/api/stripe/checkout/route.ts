import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/types";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    if (session.user.subscriptionStatus !== "active") {
      return NextResponse.json(
        { error: "有効なサブスクリプションが必要です" },
        { status: 403 }
      );
    }

    const { items } = await request.json() as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "カートが空です" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Verify products and stock
    const productIds = items.map((item) => item.product.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    for (const item of items) {
      const product = products.find((p) => p.id === item.product.id);
      if (!product) {
        return NextResponse.json(
          { error: `商品が見つかりません: ${item.product.nameJa}` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `在庫不足: ${product.nameJa}` },
          { status: 400 }
        );
      }
    }

    // Get or create Stripe customer
    let stripeCustomerId = session.user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: { userId: session.user.id },
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customer.id },
      });
    }

    // Build line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: item.product.nameJa,
          description: item.product.description,
          images: [item.product.imageUrl],
        },
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    }));

    // Add shipping fee
    lineItems.push({
      price_data: {
        currency: "jpy",
        product_data: {
          name: "送料",
          description: "全国一律送料",
          images: [],
        },
        unit_amount: 800,
      },
      quantity: 1,
    });

    // Create order in database (pending)
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: subtotal + 800,
        shippingFee: 800,
        status: "pending",
        orderItems: {
          create: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${appUrl}/account?order=success&orderId=${order.id}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        userId: session.user.id,
        orderId: order.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "チェックアウトの作成に失敗しました" },
      { status: 500 }
    );
  }
}
