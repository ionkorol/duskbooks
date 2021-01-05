import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../../utils/firebaseAdmin";
import subjects from "./subjects.json";
import { server } from "../../../config";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.referer || !req.headers.referer.includes(server)) {
    res.statusCode = 200;
    res.json({ status: false, error: "Not Allowed" });
  }
  try {
    res.statusCode = 200;
    res.json({
      status: true,
      data: Object.values(subjects).map((subject) => subject.trim()),
    });
  } catch (error) {
    res.statusCode = 200;
    res.json({ status: false, data: error });
  }
};
