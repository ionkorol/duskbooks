import nookies from "nookies";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React, { FormEvent, useState } from "react";
import { Button, Layout } from "../../../components";
import { useAuth } from "../../../hooks";
import firebaseAdmin from "../../../utils/firebaseAdmin";

import styles from "./signin.module.scss";

interface Props {}

const Signin: React.FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    auth.signIn(email, password);
  };

  return (
    <Layout small>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email ..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password ..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Log In</button>
        </form>
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

    // FETCH STUFF HERE!! 🚀
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();

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
