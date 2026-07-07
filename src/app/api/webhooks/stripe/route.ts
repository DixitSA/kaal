import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { updateUserByStripeCustomerId } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not configured" }, { status: 500 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as { customer?: string; subscription?: string };
        if (session.customer && session.subscription) {
          const updated = await updateUserByStripeCustomerId(session.customer, {
            subscriptionStatus: "pro",
            subscriptionId: session.subscription,
          });
          if (!updated) {
            console.error("[webhook] checkout.session.completed: no local user for customer", session.customer);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as {
          customer: string;
          status: string;
          id: string;
        };
        const statusMap: Record<string, "free" | "pro"> = {
          active: "pro",
          past_due: "pro",
          canceled: "free",
          unpaid: "free",
        };
        const updated = await updateUserByStripeCustomerId(subscription.customer, {
          subscriptionStatus: statusMap[subscription.status] || "free",
          subscriptionId: subscription.id,
        });
        if (!updated) {
          console.error("[webhook] customer.subscription.updated: no local user for customer", subscription.customer);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as { customer: string; id: string };
        const updated = await updateUserByStripeCustomerId(subscription.customer, {
          subscriptionStatus: "free",
          subscriptionId: undefined,
        });
        if (!updated) {
          console.error("[webhook] customer.subscription.deleted: no local user for customer", subscription.customer);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] error:", err);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }
}
