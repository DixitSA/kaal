import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUserByEmail, updateUser } from "@/lib/db";

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
          const customers = await stripe.customers.list({ limit: 1 });
          const customer = customers.data.find((c) => c.id === session.customer);
          if (customer?.email) {
            updateUser(customer.email, {
              subscriptionStatus: "pro",
              subscriptionId: session.subscription as string,
            });
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
        const customers = await stripe.customers.list({ limit: 100 });
        const customer = customers.data.find((c) => c.id === subscription.customer);
        if (customer?.email) {
          updateUser(customer.email, {
            subscriptionStatus: statusMap[subscription.status] || "free",
            subscriptionId: subscription.id,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as { customer: string; id: string };
        const customers = await stripe.customers.list({ limit: 100 });
        const customer = customers.data.find((c) => c.id === subscription.customer);
        if (customer?.email) {
          updateUser(customer.email, {
            subscriptionStatus: "free",
            subscriptionId: undefined,
          });
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
