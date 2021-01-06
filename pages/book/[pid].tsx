import React from "react";
import { GetServerSideProps } from "next";
import { ADT, BookShelf } from "components/product";
import { server } from "config";
import { Layout } from "components/common";
import { BookDataProp, FirebaseUserProp } from "utils/interfaces";

import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

import styles from "./Book.module.scss";

interface Props {
  bookData: BookDataProp;
  userData: FirebaseUserProp | null;
  uid: string;
  error?: any;
}

const Book: React.FC<Props> = (props) => {
  const { bookData, userData, uid, error } = props;

  return (
    <Layout small>
      <div className={styles.container}>
        <div className={styles.cover}>
          <img
            src={`http://images.amazon.com/images/P/${bookData.isbn10}.jpg`}
            alt={bookData.title}
            width={300}
            height={400}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.title}>{bookData.title}</div>
          <div className={styles.author}>by {bookData.contributor1}</div>
          <div className={styles.ratingStars}>****</div>
          <div className={styles.share}>f g b</div>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: bookData.description }}
          ></div>
          <div className={styles.attributes}>
            <div className={styles.column}>
              <div className={styles.attribute}>
                <div className={styles.key}>Language:</div>
                <div className={styles.value}>{bookData.language}</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>Pages:</div>
                <div className={styles.value}>{bookData.pages}</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>Date:</div>
                <div className={styles.value}>{bookData.pubDate}</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>ISBN:</div>
                <div className={styles.value}>{bookData.isbn13}</div>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.attribute}>
                <div className={styles.key}>Length:</div>
                <div className={styles.value}>{bookData.length} in</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>Width:</div>
                <div className={styles.value}>{bookData.width} in</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>Height:</div>
                <div className={styles.value}>{bookData.height} in</div>
              </div>
              <div className={styles.attribute}>
                <div className={styles.key}>Weight:</div>
                <div className={styles.value}>{bookData.weight} lbs</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.adt}>
          <ADT bookData={bookData} />
        </div>
      </div>
      <div className={styles.related}>
        <BookShelf subject="Fiction" />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    var uid = null;
    var userData = null;
    if (cookies.token) {
      const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
      uid = token.uid;
    }
    if (uid) {
      userData = (
        await firebaseAdmin.firestore().collection("users").doc(uid).get()
      ).data();
    }

    const bookId = ctx.query.pid;
    const res = await fetch(`${server}/api/product/${bookId}`);
    const bookJson = await res.json();

    return {
      props: {
        bookData: bookJson.data,
        userData,
        uid,
      },
    };
  } catch (error) {
    return {
      props: {
        error: JSON.stringify(error),
      },
    };
  }
};

export default Book;
