import { useEffect, useState } from "react";
import { BookDataProp } from "utils/interfaces";

import styles from "./MiniCart.module.scss";
interface Props {
  cart: any;
}

const MiniCart: React.FC<Props> = (props) => {
  const { cart } = props;
  const [items, setItems] = useState<
    {
      quantity: number;
      data: BookDataProp;
    }[]
  >();
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cart
      .getItems()
      .then((data) => setItems(data))
      .then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!items) {
      return;
    }
    setTotalPrice(0);
    items.forEach((item) => {
      setTotalPrice(
        (prevState) => prevState + item.quantity * item.data.salePrice
      );
    });
  }, [items]);

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartTitle}>Cart Summary</div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        items.map((item) => (
          <div className={styles.cartItem} key={item.data.isbn13}>
            <div>
              <img
                src={`http://images.amazon.com/images/P/${item.data.isbn10}.jpg`}
                alt="book name"
                width={50}
                height={50}
              />
            </div>
            <div>{item.data.title}</div>
            <div>
              <div>{item.quantity}</div>
              <div>${Number(item.data.salePrice) * Number(item.quantity)}</div>
            </div>
          </div>
        ))
      )}
      <div className={styles.cartTotal}>
        <div>Subtotal:</div>
        <div>${totalPrice}</div>
      </div>
      <div className={styles.cartTotal}>
        <div>Shipping:</div>
        <div>$3.99</div>
      </div>
      <div className={styles.cartTotal}>
        <div>Total:</div>
        <div>${(totalPrice + 3.99).toFixed(2)}</div>
      </div>
    </div>
  );
};

export default MiniCart;
