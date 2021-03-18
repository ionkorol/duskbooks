import React from "react";
import { GetServerSideProps } from "next";
import { ProductProp } from "utils/interfaces";
import { BookPreview } from "components/product";
import { Layout } from "components/common";

import styles from "./Subject.module.scss";
import { useRouter } from "next/router";

interface Props {
  data: ProductProp[];
}

const Subject: React.FC<Props> = (props) => {
  const { data } = props;

  const router = useRouter();

  return (
    <Layout title={`${router.query.subject} | DuskBooks.com`}>
      <div className={styles.container}>
        {data.map((product) => (
          <BookPreview data={product} loading={false} key={product.isbn13} />
        ))}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { subject } = ctx.query;

  try {
    const data = await (
      await fetch(`${process.env.SERVER}/api/subjects/${subject}`)
    ).json();

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

export default Subject;
