import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../../utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    const { userId, itemId } = req.body;
    try {
      const write = await firebaseAdmin
        .firestore()
        .collection("shoppingCarts")
        .doc(userId)
        .collection("items")
        .doc(itemId)
        .delete();
      res.statusCode = 200;
      res.json({ status: true, data: write });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error });
    }
  } else if (req.method === "PATCH") {
    const { userId, itemId, quantity } = req.body;
    try {
      const write = await firebaseAdmin
        .firestore()
        .collection("shoppingCarts")
        .doc(userId)
        .collection("items")
        .doc(itemId)
        .update({
          quantity,
        });
      res.statusCode = 200;
      res.json({ status: true, data: write });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error });
    }
  }
};
