const dev = process.env.NODE_ENV === "development";
const test = process.env.NODE_ENV === "test";
const prod = process.env.NODE_ENV === "production";

export const server = dev
  ? "http://localhost:3000"
  : test
  ? "https://duskbooks.vercel.app"
  : "https://duskbooks.vercel.app";
