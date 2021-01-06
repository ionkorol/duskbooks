import React from "react";
import { GetServerSidePropsContext } from "next";

import { Layout } from "components/common";
import { BookShelf } from "components/product";

import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

import styles from "styles/Home.module.scss";

const Home = (props) => {
  console.log(props.message);

  return (
    <Layout title="Books and other Media Products | DuskBooks.com">
      <div className={styles.container}>
        <div className={styles.section}>
          <BookShelf subject={"Young Adult Nonfiction"} />
        </div>
        <div className={styles.section}>
          <BookShelf subject={"True Crime"} />
        </div>
        <div className={styles.section}>
          <BookShelf subject={"Health & Fitness"} />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const cookies = nookies.get(ctx);
  var uid = null;
  var userData = null;
  if (cookies.token) {
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    uid = token.uid;
  }

  return {
    props: {
      uid,
      userData,
    },
  };
};

export default Home;
