import React from "react";
import { useCart } from "../../hooks";

import styles from "./adt.module.scss";
import { BookDataProp } from "../../utils/interfaces";

interface Props {
  bookData: BookDataProp;
}

const ADT: React.FC<Props> = (props) => {
  const { bookData } = props;

  const cart = useCart();

  return (
    <div className={styles.container}>
      <div className={styles.price}>
        <p className={styles.current}>$ {bookData.salePrice}</p>
        <p className={styles.initial}>$ {bookData.regPrice}</p>
        <p className={styles.location}>Online</p>
      </div>
      <div className={styles.perks}>
        <div>
          <img
            src="https://cdn1.iconfinder.com/data/icons/shopping-and-commerce-filled/512/Shopping_and_Commerce_-_filled_20-512.png"
            alt="Fast Shipping"
            width={50}
            height={50}
          />
          <p>Fast Delivery Across US</p>
        </div>
        <div>
          <img
            src="https://cdn1.iconfinder.com/data/icons/shopping-and-commerce-filled/512/Shopping_and_Commerce_-_filled_20-512.png"
            alt="Fast Shipping"
            width={50}
            height={50}
          />
          <p>Fast Delivery Across US</p>
        </div>
        <div>
          <img
            src="https://cdn1.iconfinder.com/data/icons/shopping-and-commerce-filled/512/Shopping_and_Commerce_-_filled_20-512.png"
            alt="Fast Shipping"
            width={50}
            height={50}
          />
          <p>Fast Delivery Across US</p>
        </div>
      </div>
      <div className={styles.buttons}>
        <button onClick={() => cart.addItem(bookData.isbn13)}>
          Add To Cart
        </button>
        <button>Add To Wishlist</button>
      </div>
    </div>
  );
};

export default ADT;
