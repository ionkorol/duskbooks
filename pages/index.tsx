import React from "react";
import { GetServerSidePropsContext } from "next";

import { Layout } from "components/common";
import { BookShelf } from "components/product";

import styles from "styles/Home.module.scss";

const Home = (props) => {
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
  return {
    props: {},
  };
};

export default Home;
