import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";
import { CartItemProp, ProductProp } from "utils/interfaces";
import { isAuth } from "utils/functions";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const uid = await isAuth(req);

      const data = [];
      const docsSnap = await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("cart")
        .get();

      for (const docSnap of docsSnap.docs) {
        const docData = docSnap.data() as CartItemProp;
        const productData = (
          await firebaseAdmin
            .firestore()
            .collection("products")
            .doc(docData.id)
            .get()
        ).data() as ProductProp;
        data.push({ data: productData, quantity: docData.quantity });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  } else if (req.method === "DELETE") {
    try {
      const uid = await isAuth(req);
      const cartQuery = await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("cart")
        .get();
      for (const item of cartQuery.docs) {
        await item.ref.delete();
      }
      res.status(200);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json({ message: "Not Allowed" });
  }
};
