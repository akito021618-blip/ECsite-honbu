import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const runtime = "nodejs";

function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.PAYJP_WEBHOOK_SECRET;
  if (!secret) return true; // skip in dev if not set
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return signature === expected;
}

interface PayjpWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("payjp-signature") ?? "";

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: PayjpWebhookEvent;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "subscription.updated":
      case "subscription.created": {
        const sub = event.data.object as {
          id: string;
          customer: string;
          status: string;
        };
        const status =
          sub.status === "active"
            ? "active"
            : sub.status === "paused"
            ? "past_due"
            : "inactive";
        await prisma.user.updateMany({
          where: { payjpCustomerId: sub.customer },
          data: { subscriptionStatus: status, subscriptionId: sub.id },
        });
        break;
      }

      case "subscription.deleted": {
        const sub = event.data.object as { customer: string };
        await prisma.user.updateMany({
          where: { payjpCustomerId: sub.customer },
          data: { subscriptionStatus: "cancelled" },
        });
        break;
      }

      case "charge.failed": {
        const charge = event.data.object as { customer: string };
        await prisma.user.updateMany({
          where: { payjpCustomerId: charge.customer },
          data: { subscriptionStatus: "past_due" },
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
