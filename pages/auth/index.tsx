import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Layout } from "components/common";
import { SignInForm, SignUpForm } from "components/auth";

import styles from "./Auth.module.scss";
import { isAuth } from "utils/functions";

interface Props {}

const Signin: React.FC<Props> = (props) => {
  const [error, setError] = useState(null);

  return (
    <Layout title="Authenticate | DuskBooks.com" small>
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
    const uid = await isAuth(ctx.req);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } catch (error) {
    return {
      props: {} as never,
    };
  }
};

export default Signin;
