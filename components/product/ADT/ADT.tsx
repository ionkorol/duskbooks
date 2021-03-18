import React from "react";
import { useAuth, useCart } from "hooks";

import styles from "./ADT.module.scss";
import { ProductProp } from "utils/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faShippingFast,
  faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  data: ProductProp;
}

const ADT: React.FC<Props> = (props) => {
  const { data } = props;

  const auth = useAuth();

  const cartId = auth.user && auth.user.id;
  const cart = useCart(cartId);

  return (
    <div className={styles.container}>
      <div className={styles.price}>
        <p className={styles.current}>$ {data.salePrice}</p>
        <p className={styles.initial}>$ {data.regPrice}</p>
        <p className={styles.location}>Online</p>
      </div>
      <div className={styles.perks}>
        <div>
          <FontAwesomeIcon icon={faShippingFast} size="2x" fixedWidth />
          <p>Fast Delivery Across US</p>
        </div>
        <div>
          <FontAwesomeIcon icon={faCreditCard} size="2x" fixedWidth />
          <p>100% Secure Payment</p>
        </div>
        <div>
          <FontAwesomeIcon icon={faUndoAlt} size="2x" fixedWidth />
          <p>Free Returns Within 30 Days</p>
        </div>
      </div>
      <div className={styles.buttons}>
        <button
          disabled={!data.stock}
          onClick={() => cart.addOrChangeItem(data.isbn13, 1)}
        >
          {!data.stock ? "Out of Stock" : "Add To Cart"}
        </button>
        <button>Add To Wishlist</button>
      </div>
    </div>
  );
};

export default ADT;
