// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const prodsQuery = await firebaseAdmin
      .firestore()
      .collection("products")
      .where("categories", "array-contains", req.query.subject)
      .limit(20)
      .get();

    const data = prodsQuery.docs.map((prod) => prod.data());
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};
