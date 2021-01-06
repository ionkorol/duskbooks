import React from "react";
import { GetServerSideProps } from "next";
import { AccountLayout } from "components/account";
import { FirebaseUserProp, OrderProp } from "utils/interfaces";
import { Alert, Table } from "react-bootstrap";
import { server } from "config";

import nookies from "nookies";
import firebaseAdmin from "utils/firebaseAdmin";

import styles from "./Order.module.scss";

interface Props {
  uid: string;
  userData: FirebaseUserProp;
  orderData: OrderProp;
}

const Order: React.FC<Props> = (props) => {
  const { uid, userData, orderData } = props;

  return (
    <AccountLayout userData={userData}>
      <div className={styles.container}>
        <Alert variant="success">
          Order #{orderData.id} was placed on{" "}
          {new Date(orderData.createdAt._seconds * 1000).toDateString()} and is
          currently {orderData.fulfillmentStatus}
        </Alert>
        <h1>Order Details</h1>
        <div className={styles.line}>
          <span>Products</span>
        </div>

        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th className={styles.total}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orderData.lineItems.map((item) => (
              <tr className={styles.product} key={item.data.isbn13}>
                <td>{item.data.title}</td>
                <td>${item.data.salePrice}</td>
                <td>{item.quantity}</td>
                <td className={styles.total}>
                  ${(item.quantity * item.data.salePrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className={styles.line}>
          <span>Subtotal</span>
          <span>${orderData.itemsTotalPrice}</span>
        </div>
        <div className={styles.line}>
          <span>Shipping</span>
          <span>${orderData.shippingPrice}</span>
        </div>
        <div className={styles.line}>
          <span>Total</span>
          <span>${orderData.totalPrice}</span>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Order;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);

  if (cookies.token) {
    var uid = null;
    var userData = null;
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    uid = token.uid;
    userData = (
      await firebaseAdmin.firestore().collection("users").doc(uid).get()
    ).data();

    const orderId = ctx.query.pid;
    const res = await fetch(`${server}/api/orders/${orderId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `token=${cookies.token}`,
      },
    });
    const orderData = (await res.json()).data;
    return {
      props: {
        uid,
        userData,
        orderData,
      },
    };
  } else {
    ctx.res.writeHead(302, { Location: "/auth" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
