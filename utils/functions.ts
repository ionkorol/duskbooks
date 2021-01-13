import { NextApiRequest, NextApiResponse } from "next";
import nookies from "nookies";
import firebaseAdmin from "./firebaseAdmin";

export const isObjectEqual = (object1, object2) => {
  return object1.name === object2.name;
};

export const isAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = nookies.get({ req });
  // if (!cookies.token) {
  //   res.writeHead(302, { Location: "/" });
  //   res.end();
  // }
  // const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
  // if (!token.uid) {
  //   res.writeHead(302, { Location: "/" });
  //   res.end();
  // }
};
