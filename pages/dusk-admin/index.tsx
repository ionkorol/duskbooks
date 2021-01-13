import React from "react";
import { GetServerSideProps } from "next";

import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";
import { FirebaseUserProp, UserProp } from "utils/interfaces";
import { AdminLayout } from "components/admin";

const Admin = (props) => {
  return <AdminLayout></AdminLayout>;
};

export default Admin;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  var uid = null;
  var userData: FirebaseUserProp = null;
  try {
    if (cookies.token) {
      const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
      uid = token.uid;
      userData = (
        await firebaseAdmin.firestore().collection("users").doc(uid).get()
      ).data() as FirebaseUserProp;
      if (userData.role === "admin") {
        return {
          props: {
            uid,
            userData,
          },
        };
      } else {
        throw new Error("Not Admin");
      }
    } else {
      throw new Error("Not Authenticated");
    }
  } catch (error) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();

    return {
      props: {} as never,
    };
  }
};
