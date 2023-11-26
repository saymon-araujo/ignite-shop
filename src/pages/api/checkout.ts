import { stripe } from "@/src/lib/stripe";
import type { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { priceId, productId } = req.body;

  if (req.method !== "POST") {
    return res.status(405);
  }

  if (!priceId || !productId) {
    return res.status(400).json({ error: "Missing priceId or productId" });
  }

  const success_url = process.env.NEXT_URL + "/success?session_id={CHECKOUT_SESSION_ID}";
  const cancel_url = process.env.NEXT_URL + `/product/${productId}`;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    cancel_url,
    success_url,
  });

  return res.status(201).json({
    checkoutUrl: checkoutSession.url,
  });
}
