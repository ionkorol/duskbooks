import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Form, Table } from "react-bootstrap";
import firebaseClient from "../../utils/firebaseClient";
import { CartItemProp, ProductProp } from "../../utils/interfaces";
import { Layout } from "components/common";

import styles from "./Cart.module.scss";
import { useAuth, useCart } from "hooks";
import { isAuth } from "utils/functions";

interface Props {
  data: CartItemProp[];
}

const Cart: React.FC<Props> = (props) => {
  const { data } = props;
  const [total, setTotal] = useState(0);
  const [currentCartItems, setCurrentCartItems] = useState(data);

  const auth = useAuth();

  const cart = useCart(auth.user && auth.user.id);

  useEffect(() => {
    setTotal(0);
    currentCartItems.forEach((item) =>
      setTotal((prevState) => prevState + item.quantity * item.data.salePrice)
    );
  }, [currentCartItems]);

  // Real Time Updates
  // useEffect(() => {
  //   const unsub = firebaseClient
  //     .firestore()
  //     .collection("shoppingCarts")
  //     .doc(uid)
  //     .collection("items")
  //     .onSnapshot(async (itemsSnap) => {
  //       let itemsData = [];
  //       for (const item of itemsSnap.docs) {
  //         const itemData = item.data() as {
  //           quantity: number;
  //           ref: firebaseClient.firestore.DocumentReference;
  //         };
  //         const prodData = (
  //           await firebaseClient.firestore().doc(itemData.ref.path).get()
  //         ).data();
  //         itemsData.push({
  //           quantity: itemData.quantity,
  //           data: prodData,
  //         });
  //       }
  //       setCurrentCartItems(itemsData);
  //     });
  //   return () => unsub();
  // }, []);

  return (
    <Layout title="Cart | DuskBooks.com" small>
      <div className={styles.container}>
        <Table striped>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {currentCartItems.map((item) => (
              <tr className={styles.item} key={item.data.isbn13}>
                <td>
                  <img
                    src={`http://images.amazon.com/images/P/${item.data.isbn10}.jpg`}
                    alt="book name"
                    width={50}
                    height={50}
                  />
                  {item.data.title}
                </td>
                <td>${item.data.salePrice}</td>
                <td>
                  <Form>
                    <Form.Group>
                      <Form.Control
                        as="select"
                        value={item.quantity}
                        onChange={(e) =>
                          cart.addOrChangeItem(
                            item.data.isbn13,
                            Number(e.target.value)
                          )
                        }
                      >
                        {[1, 2, 3, 4, 5].map((index) => (
                          <option key={index}>{index}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Form>
                </td>
                <td>
                  <button
                    onClick={() => cart.removeItem(item.data.isbn13)}
                    style={{ width: "50px" }}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className={styles.cartFooter}>
          <div>
            <Link href="/checkout">
              <button disabled={currentCartItems.length === 0}>
                Check Out
              </button>
            </Link>
          </div>
          <div className={styles.total}>
            Total:
            <span> ${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const uid = await isAuth(ctx.req);

    const data = await (
      await fetch(`${process.env.SERVER}/api/users/${uid}/cart`)
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

export default Cart;
