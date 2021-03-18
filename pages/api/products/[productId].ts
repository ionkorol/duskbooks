import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { productId } = req.query;
  if (req.method === "GET") {
    try {
      const data = (
        await firebaseAdmin
          .firestore()
          .collection("products")
          .doc(productId as string)
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
