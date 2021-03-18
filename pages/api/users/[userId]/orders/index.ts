import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { isAuth } from "utils/functions";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  if (req.method === "GET") {
    try {
      const ordersQuery = await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(userId as string)
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
