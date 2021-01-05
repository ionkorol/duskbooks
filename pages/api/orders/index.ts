import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../../utils/firebaseAdmin";
import nookies from "nookies";
import { OrderInProp } from "../../../utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
  const { uid } = token;

  if (req.method === "POST") {
    try {
      const {
        id,
        lineItems,
        totalPrice,
        shippingAddress,
        billingAddress,
        paymentType,
      } = req.body;
      // Get Last Order Id
      const lastOrderQuery = await firebaseAdmin
        .firestore()
        .collection("orders")
        .orderBy("id", "desc")
        .limit(1)
        .get();
      const lastOrderId = lastOrderQuery.docs[0].data().id;

      // Add Order Details to the DB
      const write = await firebaseAdmin
        .firestore()
        .collection("orders")
        .doc(String(lastOrderId + 1))
        .set({
          id: lastOrderId + 1,
          lineItems: lineItems,
          totalPrice: totalPrice,
          userId: uid,
          createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
          fulfillmentStatus: "Processing",
          shippingAddress: shippingAddress,
          billingAddress: billingAddress,
          paymentMethod: paymentType,
        } as OrderInProp);
      res.statusCode = 200;
      res.json({
        status: true,
        data: write,
      });
    } catch (error) {
      res.statusCode = 200;
      res.json({
        status: false,
        error,
      });
    }
  } else if (req.method === "GET") {
    try {
      const { id } = req.body;
      const orderData = (
        await firebaseAdmin.firestore().collection("orders").doc(id).get()
      ).data();
      res.statusCode = 200;
      res.json({ status: true, data: orderData });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error });
    }
  }
};
