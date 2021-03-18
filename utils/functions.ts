import { GetServerSidePropsContext, NextApiRequest } from "next";
import nookies from "nookies";
import firebaseAdmin from "./firebaseAdmin";

export const isAuth = async (req: any) => {
  try {
    const { token } = nookies.get({ req });
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);

    return uid;
  } catch (error) {
    throw { message: "Not Authenticated" };
  }
};

export const toDate = (time: number) => {
  return new Date(time).toLocaleDateString();
};
