import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { isAuth } from "utils/functions";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await isAuth(req, res);

  if (req.method === "GET") {
    try {
      const query = await firebaseAdmin.firestore().collection("users").get();
      const data = query.docs.map((doc) => doc.data());
      res.statusCode = 200;
      res.json({ status: true, data });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error });
    }
  } else {
    res.statusCode = 405;
    res.writeHead(302, { Location: "/" });
    res.end();
  }
};
