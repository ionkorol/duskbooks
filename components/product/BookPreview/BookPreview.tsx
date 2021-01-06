import Link from "next/link";
import React from "react";
import { useAuth, useCart } from "hooks";
import { BookDataProp } from "utils/interfaces";

import styles from "./BookPreview.module.scss";

interface Props {
  bookData: BookDataProp;
  loading: boolean;
}

const BookPreview: React.FC<Props> = (props) => {
  const { bookData, loading } = props;

  const auth = useAuth();
  const cartId = auth.user && auth.user.credentials.uid;

  const cart = useCart(cartId);

  return (
    <div className={styles.contaier}>
      <img
        src={
          loading
            ? "https://media1.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
            : `http://images.amazon.com/images/P/${bookData.isbn10}.jpg`
        }
        alt={loading ? "Loading Title" : bookData.title}
        width={150}
        height={200}
        className={styles.cover}
      />
      <Link
        href={{
          pathname: "/book/[pid]",
          query: { pid: bookData ? bookData.isbn13 : null },
        }}
      >
        <a className={styles.link}>{loading ? "Loading..." : bookData.title}</a>
      </Link>
      <p className={styles.price}>
        $ {loading ? "loading price" : bookData.salePrice}
      </p>
      <button
        disabled={bookData ? !bookData.stock : true}
        className={styles.adt}
        onClick={() => cart.addItem(bookData.isbn13)}
      >
        {bookData && !bookData.stock ? "Out of Stock" : "Add To Cart"}
      </button>
    </div>
  );
};

export default BookPreview;
