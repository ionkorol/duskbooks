// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../../utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const prodsQuery = await firebaseAdmin
      .firestore()
      .collection("products")
      .where("categories", "array-contains", req.query.subject)
      .limit(20)
      .get();

    const prodsData = prodsQuery.docs.map((prod) => prod.data());
    res.statusCode = 200;
    res.json({ status: true, data: prodsData });
  } catch (error) {
    res.statusCode = 200;
    res.json({ status: false, data: error });
  }
};
