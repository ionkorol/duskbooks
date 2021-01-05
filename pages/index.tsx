import Head from "next/head";
import { BookShelf, Layout } from "../components";
import styles from "../styles/Home.module.scss";

import nookies from "nookies";
import firebaseAdmin from "../utils/firebaseAdmin";
import { GetServerSidePropsContext } from "next";

const Home = (props) => {
  console.log(props.message);

  return (
    <Layout>
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
