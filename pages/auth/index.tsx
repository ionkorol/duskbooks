import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Layout } from "components/common";
import { SignInForm, SignUpForm } from "../../components/auth";
import { useRouter } from "next/router";

import nookies from "nookies";
import firebaseAdmin from "../../utils/firebaseAdmin";

import styles from "./Auth.module.scss";

interface Props {}

const Signin: React.FC<Props> = (props) => {
  const [error, setError] = useState(null);

  const router = useRouter();

  return (
    <Layout small>
      <div className={styles.container}>
        <div>
          <SignInForm />
        </div>
        <div>
          <SignUpForm />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    // the user is authenticated!
    const { uid, email } = token;

    if (email) {
      // FETCH STUFF HERE!! 🚀
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();

      return { props: {} as never };
    }
    return { props: {} as never };
  } catch (error) {
    return {
      props: {
        error: JSON.stringify(error),
      },
    };
  }
};

export default Signin;
