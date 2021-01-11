import React from "react";
import { Layout } from "components/common";

import styles from "./Search.module.scss";
import { GetServerSideProps } from "next";
import { server } from "config";

interface Props {}

const Search: React.FC<Props> = (props) => {
  return (
    <Layout title={`Search Result for `}>
      <div className={styles.container}></div>
    </Layout>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const search = ctx.query.slug;
  // const res = await fetch(`${server}/api/products`, {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     search,
  //   }),
  // });

  // const data = (await res.json()).data;
  return {
    props: {},
  };
};
