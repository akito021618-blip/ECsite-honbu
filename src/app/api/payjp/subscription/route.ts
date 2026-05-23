import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCustomer, createSubscription } from "@/lib/payjp";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { token } = await request.json();
    if (!token) {
      return NextResponse.json(
        { error: "カードトークンが必要です" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    let payjpCustomerId = user.payjpCustomerId;

    if (!payjpCustomerId) {
      const customer = await createCustomer(user.email, token);
      payjpCustomerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { payjpCustomerId: customer.id },
      });
    }

    const subscription = await createSubscription(payjpCustomerId);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: subscription.status === "active" ? "active" : "inactive",
        subscriptionId: subscription.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "サブスクリプションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
