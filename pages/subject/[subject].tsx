import React from "react";
import { GetServerSideProps } from "next";
import { server } from "config";
import { BookDataProp } from "utils/interfaces";
import { BookPreview } from "components/product";
import { Layout } from "components/common";

import styles from "./Subject.module.scss";

interface Props {
  products: BookDataProp[];
}

const Subject: React.FC<Props> = (props) => {
  const { products } = props;
  return (
    <Layout>
      <div className={styles.container}>
        {products.map((product) => (
          <BookPreview
            bookData={product}
            loading={false}
            key={product.isbn13}
          />
        ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await fetch(`${server}/api/subject/${ctx.query.subject}`);
  const jsonData = await res.json();

  return {
    props: {
      products: jsonData.data,
    },
  };
};

export default Subject;
