import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCustomer, createCharge, SHIPPING_FEE } from "@/lib/payjp";
import type { CartItem } from "@/types";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    if (session.user.subscriptionStatus !== "active") {
      return NextResponse.json(
        { error: "有効なサブスクリプションが必要です" },
        { status: 403 }
      );
    }

    const { token, items } = (await request.json()) as {
      token: string;
      items: CartItem[];
    };

    if (!token || !items?.length) {
      return NextResponse.json(
        { error: "カード情報と商品が必要です" },
        { status: 400 }
      );
    }

    // Verify stock
    const productIds = items.map((i) => i.product.id);
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

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const total = subtotal + SHIPPING_FEE;

    // Create order (pending)
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        shippingFee: SHIPPING_FEE,
        status: "pending",
        orderItems: {
          create: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { orderItems: true },
    });

    // Get or create PAY.JP customer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    let payjpCustomerId = user?.payjpCustomerId;

    if (!payjpCustomerId) {
      const customer = await createCustomer(session.user.email, token);
      payjpCustomerId = customer.id;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { payjpCustomerId: customer.id },
      });
    }

    // Create charge
    const charge = await createCharge(
      payjpCustomerId,
      total,
      `注文 #${order.id.slice(-8)}`
    );

    if (charge.paid) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "paid" },
      });

      for (const item of order.orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return NextResponse.json({ success: true, orderId: order.id });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: "failed" },
    });
    return NextResponse.json({ error: "決済に失敗しました" }, { status: 402 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "チェックアウトに失敗しました" },
      { status: 500 }
    );
  }
}
