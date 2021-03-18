import { useEffect, useState } from "react";
import { CartItemProp } from "utils/interfaces";

import styles from "./MiniCart.module.scss";
interface Props {
  data: CartItemProp[];
}

const MiniCart: React.FC<Props> = (props) => {
  const { data } = props;
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!data) {
      return;
    }
    setTotalPrice(0);
    data.forEach((item) => {
      setTotalPrice(
        (prevState) => prevState + item.quantity * item.data.salePrice
      );
    });
  }, [data]);

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartTitle}>Cart Summary</div>
      {data.map((item) => (
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
      ))}
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
