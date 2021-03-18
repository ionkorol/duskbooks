import React from "react";
import { GetServerSideProps } from "next";
import { ADT, BookShelf } from "components/product";
import { Layout } from "components/common";
import { ProductProp } from "utils/interfaces";

import styles from "./Book.module.scss";

interface Props {
  data: ProductProp;
}

const Book: React.FC<Props> = (props) => {
  const { data } = props;

  return (
    <Layout title={`${data.title} by ${data.contributor1}`} small>
      <div className={styles.container}>
        <div className={styles.cover}>
          <img
            src={`http://images.amazon.com/images/P/${data.isbn10}.jpg`}
            alt={data.title}
            width={300}
            height={400}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.title}>{data.title}</div>
          <div className={styles.author}>by {data.contributor1}</div>
          <div className={styles.ratingStars}>****</div>
          <div className={styles.share}>f g b</div>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: data.description }}
          ></div>
          <div className={styles.attributes}>
            <div className={styles.column}>
              <div className={styles.attribute}>
                <div className={styles.key}>Language:</div>
                <div className={styles.value}>{data.language}</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>Pages:</div>
                <div className={styles.value}>{data.pages}</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>Date:</div>
                <div className={styles.value}>{data.pubDate}</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>ISBN:</div>
                <div className={styles.value}>{data.isbn13}</div>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.attribute}>
                <div className={styles.key}>Length:</div>
                <div className={styles.value}>{data.length} in</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>Width:</div>
                <div className={styles.value}>{data.width} in</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>Height:</div>
                <div className={styles.value}>{data.height} in</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>Weight:</div>
                <div className={styles.value}>{data.weight} lbs</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.adt}>
          <ADT data={data} />
        </div>
      </div>
      <div className={styles.related}>
        <BookShelf subject="Fiction" />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { pid } = ctx.query;

  try {
    const data = await (
      await fetch(`${process.env.SERVER}/api/products/${pid}`)
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

export default Book;
