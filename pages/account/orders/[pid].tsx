import React from "react";
import { GetServerSideProps } from "next";
import { AccountLayout } from "components/account";
import { Alert, Table } from "react-bootstrap";

import styles from "./Order.module.scss";
import { isAuth } from "utils/functions";
import { OrderProp } from "utils/interfaces";

interface Props {
  data: OrderProp;
}

const Order: React.FC<Props> = (props) => {
  const { data } = props;

  return (
    <AccountLayout>
      <div className={styles.container}>
        <Alert variant="success">
          Order #{data.id} was placed on{" "}
          {new Date(data.createdAt * 1000).toDateString()} and is currently{" "}
          {data.fulfillmentStatus}
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
            {data.lineItems.map((item) => (
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
          <span>${data.itemsTotalPrice}</span>
        </div>
        <div className={styles.line}>
          <span>Shipping</span>
          <span>${data.shippingPrice}</span>
        </div>
        <div className={styles.line}>
          <span>Total</span>
          <span>${data.totalPrice}</span>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Order;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { pid } = ctx.query;
  try {
    const uid = await isAuth(ctx.req);
    const data = await (
      await fetch(`${process.env.SERVER}/api/users/${uid}/orders/${pid}`)
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
