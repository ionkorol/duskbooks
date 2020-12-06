import React from "react";
import Button from "../button";

import styles from "./book.module.scss";

interface Props {
  bookData: {
    isbn10: string;
    ean: string;
    title: string;
    price: number;
    salePrice: number;
    stock: number;
  };
  loading: boolean;
}

const Book: React.FC<Props> = (props) => {
  const { bookData, loading } = props;

  console.log(loading , bookData)

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
      <a href={loading ? '#' : `/book/${bookData.ean}`} className={styles.link}>
        {loading ? "Loading..." : bookData.title}
      </a>
      <p className={styles.price}>
        $ {loading ? "loading price" : bookData.salePrice}
      </p>
      <Button href="#">Add To Cart</Button>
    </div>
  );
};

export default Book;
