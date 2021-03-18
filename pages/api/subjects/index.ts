import { NextApiRequest, NextApiResponse } from "next";
import subjects from "./subjects.json";

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
