import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { CartItemProp, ProductProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  if (req.method === "GET") {
    try {
      const data = [];
      const docsSnap = await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(userId as string)
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
  } else {
    res.status(500).json({ message: "Not Allowed" });
  }
};
