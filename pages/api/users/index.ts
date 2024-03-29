import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { isAuth } from "utils/functions";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const uid = await isAuth(req);

      // Get base data
      const data = (
        await firebaseAdmin.firestore().collection("users").doc(uid).get()
      ).data();

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json({ message: "Not Allowed" });
  }
};
