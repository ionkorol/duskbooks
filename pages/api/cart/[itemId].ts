import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { isAuth } from "utils/functions";
import { CartItemProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { itemId } = req.query;
  if (req.method === "DELETE") {
    // Remove item from cart
    try {
      const uid = await isAuth(req);
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("cart")
        .doc(itemId as string)
        .delete();
      res.status(200);
    } catch (error) {
      res.status(500).json(error);
    }
  } else if (req.method === "POST") {
    // Add or update item to cart
    const { quantity } = req.body;

    try {
      const uid = await isAuth(req);
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("cart")
        .doc(itemId as string)
        .set({
          id: itemId,
          quantity,
        } as CartItemProp);

      res.status(200).end();
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
