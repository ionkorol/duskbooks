const dev = process.env.NODE_ENV === "development";
const test = process.env.NODE_ENV === "test";
const prod = process.env.NODE_ENV === "production";

export const server = dev
  ? "http://localhost:3000"
  : test
  ? "https://duskbooks.com"
  : "https://duskbooks.com";

export const paypalApiKey = prod
  ? process.env.NEXT_PUBLIC_PAYPAL_API_KEY
  : process.env.NEXT_PUBLIC_PAYPAL_API_KEY_DEV;
