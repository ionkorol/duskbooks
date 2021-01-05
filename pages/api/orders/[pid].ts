import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../../utils/firebaseAdmin";
import nookies from "nookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
  const { uid } = token;
  if (req.method === "GET") {
    try {
      const { pid } = req.query;
      const orderData = (
        await firebaseAdmin
          .firestore()
          .collection("orders")
          .doc(pid as string)
          .get()
      ).data();
      res.statusCode = 200;
      res.json({ status: true, data: orderData });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error });
    }
  }
};
