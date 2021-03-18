import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { ProductProp, OrderProp } from "utils/interfaces";
import { isAuth } from "utils/functions";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const uid = await isAuth(req);
      const {
        lineItems,
        shippingAddress,
        billingAddress,
        paymentMethod,
      } = req.body;

      // Get Last Order Id
      const lastOrderQuery = await firebaseAdmin
        .firestore()
        .collectionGroup("orders")
        .get();
      const orderId =
        lastOrderQuery.docs[lastOrderQuery.docs.length - 1].data().id + 1;

      // Items Total Price
      let itemsTotalPrice = 0;
      lineItems.forEach((item: { quantity: number; data: ProductProp }) => {
        itemsTotalPrice += item.quantity * item.data.salePrice;
      });

      // Total Price
      let totalPrice = Number((itemsTotalPrice + 3.99).toFixed(2));

      // Add Order Details to the DB
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("orders")
        .doc(String(orderId))
        .set({
          id: orderId,
          lineItems,
          itemsTotalPrice,
          totalPrice,
          createdAt: Date.now(),
          fulfillmentStatus: "Processing",
          shippingAddress,
          billingAddress,
          paymentMethod,
          shippingPrice: 3.99,
        } as OrderProp);
      res.status(200).json({ id: orderId });
    } catch (error) {
      res.status(500).json(error);
    }
  } else if (req.method === "GET") {
    try {
      const uid = await isAuth(req);
      const ordersQuery = await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("orders")
        .get();
      const data = ordersQuery.docs.map((doc) => doc.data());
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json({ message: "Not Allowed" });
  }
};
