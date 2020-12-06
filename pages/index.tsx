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
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.section}>
        <BookShelf />
      </div>
      <div className={styles.section}>
        <BookShelf />
      </div>
      <div className={styles.section}>
        <BookShelf />
      </div>
    </Layout>
  );
};


export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    // the user is authenticated!
    const { uid, email } = token;

    // FETCH STUFF HERE!! 🚀

    return {
      props: { message: `Your email is ${email} and your UID is ${uid}.` },
    };
  } catch (err) {
    ctx.res.writeHead(302, { Location: "/auth/signin" });
    ctx.res.end();

    return { props: {} as never };
  }
};

export default Home;
