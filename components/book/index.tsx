import Link from "next/link";
import React from "react";
import { useCart } from "../../hooks";
import { BookDataProp } from "../../utils/interfaces";

import styles from "./book.module.scss";

interface Props {
  bookData: BookDataProp;
  loading: boolean;
}

const Book: React.FC<Props> = (props) => {
  const { bookData, loading } = props;

  const cart = useCart();

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
      <button onClick={() => cart.addItem(bookData.isbn13)}>Add To Cart</button>
    </div>
  );
};

export default Book;
