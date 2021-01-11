import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../../utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const prodSnap = await firebaseAdmin
      .firestore()
      .collection("products")
      .doc(req.query.isbn as string)
      .get();

    const prodData = prodSnap.data()
    res.statusCode = 200;
    res.json({ status: true, data: prodData });
  } catch (error) {
    res.statusCode = 200;
    res.json({ status: false, data: error });
  }
};
