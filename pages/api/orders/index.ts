import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../../utils/firebaseAdmin";
import nookies from "nookies";
import { BookDataProp, OrderInProp } from "../../../utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
  const { uid } = token;

  if (req.method === "POST") {
    try {
      const {
        lineItems,
        shippingAddress,
        billingAddress,
        paymentMethod,
        userId,
      } = req.body;

      if (uid !== userId) {
        res.statusCode = 200;
        res.json({ status: false, error: "Not Allowed" });
      }
      // Get Last Order Id
      const lastOrderQuery = await firebaseAdmin
        .firestore()
        .collection("orders")
        .orderBy("id", "desc")
        .limit(1)
        .get();
      const orderId = lastOrderQuery.docs[0].data().id + 1;

      // Items Total Price
      let itemsTotalPrice = 0;
      lineItems.forEach((item: { quantity: number; data: BookDataProp }) => {
        itemsTotalPrice += item.quantity * item.data.salePrice;
      });

      // Total Price
      let totalPrice = Number((itemsTotalPrice + 3.99).toFixed(2));

      // Add Order Details to the DB
      const write = await firebaseAdmin
        .firestore()
        .collection("orders")
        .doc(String(orderId))
        .set({
          id: orderId,
          lineItems,
          itemsTotalPrice,
          totalPrice,
          userId: uid,
          createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          fulfillmentStatus: "Processing",
          shippingAddress,
          billingAddress,
          paymentMethod,
          shippingPrice: 3.99,
        } as OrderInProp);
      res.statusCode = 200;
      res.json({
        status: true,
        data: {
          id: orderId,
        },
      });
    } catch (error) {
      res.statusCode = 200;
      res.json({
        status: false,
        error,
      });
    }
  }
};
