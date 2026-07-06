import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { updateUser } from "@/lib/db";

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
        try {
          const customer = await stripe.customers.retrieve(session.customer as string);
          if (customer.deleted) break;
          if (customer.email) {
            await updateUser(customer.email, {
              subscriptionStatus: "pro",
              subscriptionId: session.subscription as string,
            });
          }
        } catch (err) {
          console.error("[webhook] customer.retrieve failed:", err);
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
      try {
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer.deleted) break;
        if (customer.email) {
          await updateUser(customer.email, {
            subscriptionStatus: statusMap[subscription.status] || "free",
            subscriptionId: subscription.id,
          });
        }
      } catch (err) {
        console.error("[webhook] customer.retrieve failed:", err);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as { customer: string; id: string };
      try {
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer.deleted) break;
        if (customer.email) {
          await updateUser(customer.email, {
            subscriptionStatus: "free",
            subscriptionId: undefined,
          });
        }
      } catch (err) {
        console.error("[webhook] customer.retrieve failed:", err);
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
