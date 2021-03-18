import { NextApiRequest, NextApiResponse } from "next";
import { isAuth } from "utils/functions";
import firebaseAdmin from "utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { orderId } = req.query;
  if (req.method === "GET") {
    try {
      const uid = await isAuth(req);
      const data = (
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("orders")
          .doc(orderId as string)
          .get()
      ).data();

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json({ message: "Not Allowed" });
  }
};
