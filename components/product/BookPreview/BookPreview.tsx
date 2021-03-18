import Link from "next/link";
import React from "react";
import { useAuth, useCart } from "hooks";
import { ProductProp } from "utils/interfaces";

import styles from "./BookPreview.module.scss";

interface Props {
  data: ProductProp;
  loading: boolean;
}

const BookPreview: React.FC<Props> = (props) => {
  const { data, loading } = props;

  const auth = useAuth();
  const cartId = auth.user && auth.user.id;

  const cart = useCart(cartId);

  return (
    <div className={styles.contaier}>
      <img
        src={
          loading
            ? "https://media1.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
            : `http://images.amazon.com/images/P/${data.isbn10}.jpg`
        }
        alt={loading ? "Loading Title" : data.title}
        width={150}
        height={200}
        className={styles.cover}
      />
      <Link
        href={{
          pathname: "/book/[pid]",
          query: { pid: data ? data.isbn13 : null },
        }}
      >
        <a className={styles.link}>{loading ? "Loading..." : data.title}</a>
      </Link>
      <p className={styles.price}>
        $ {loading ? "loading price" : data.salePrice}
      </p>
      <button
        disabled={data ? !data.stock : true}
        className={styles.adt}
        onClick={() => cart.addOrChangeItem(data.isbn13, 1)}
      >
        {data && !data.stock ? "Out of Stock" : "Add To Cart"}
      </button>
    </div>
  );
};

export default BookPreview;
