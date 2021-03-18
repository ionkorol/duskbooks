import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { CartItemProp } from "utils/interfaces";

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2020-08-27",
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { items } = req.body;
    // Alternatively, set up a webhook to listen for the payment_intent.succeeded event
    // and attach the PaymentMethod to a new Customer
    const customer = await stripe.customers.create();

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customer.id,
      setup_future_usage: "off_session",
      amount: calculateOrderAmount(items),
      currency: "usd",
    });

    res.status(200).json({
      secret: paymentIntent.client_secret,
    });
  } else {
    res.status(500).json({ message: "Not Allowed" });
  }
};

const calculateOrderAmount = (items: CartItemProp[]) => {
  let total = 0;
  items.forEach((item) => {
    total += item.data.salePrice * item.quantity;
  });
  return total * 100;
};
