import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any, // Using the closest stable version type
  appInfo: {
    name: "Sparkling Bakery",
    version: "1.0.0",
  },
});
