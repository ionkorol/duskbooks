import React from "react";

import { Layout } from "../../../components";
import { OrderProp, UserWithOrdersProp } from "../../../utils/interfaces";
import { Table } from "react-bootstrap";
import nookies from "nookies";

import styles from "./Orders.module.scss";
import { AccountLayout } from "../../../components/account";
import { GetServerSideProps } from "next";
import firebaseAdmin from "../../../utils/firebaseAdmin";

interface Props {
  userData: UserWithOrdersProp;
}

const AccountOrders: React.FC<Props> = (props) => {
  const { userData } = props;

  return (
    <AccountLayout userData={userData}>
      <div className={styles.ordersContainer}>
        <Table striped>
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {userData.orders.map((order) => (
              <tr className={styles.order} key={order.id}>
                <td># {order.id}</td>
                <td>{order.createdAt}</td>
                <td>{order.lineItems.length}</td>
                <td>{order.totalPrice}</td>
                <td>{order.fulfillmentStatus}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </AccountLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;

    if (!email) {
      ctx.res.writeHead(302, { Location: "/auth/signin" });
      ctx.res.end();
      return {
        props: {} as never,
      };
    }

    const userSnap = await firebaseAdmin
      .firestore()
      .collection("users")
      .doc(uid)
      .get();
    const userData = userSnap.data();

    const ordersQuery = await firebaseAdmin
      .firestore()
      .collection("orders")
      .where("userId", "==", userSnap.id)
      .get();

    const ordersData = ordersQuery.docs.map((order) => {
      const orderData = order.data();
      delete orderData.user;
      const date: Date = orderData.createdAt.toDate().toLocaleDateString();
      return {
        ...orderData,
        createdAt: date,
      };
    });

    return {
      props: {
        userData: {
          ...userData,
          orders: ordersData,
        },
      },
    };
  } catch (error) {
    ctx.res.writeHead(302, { Location: "/auth/signin" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};

export default AccountOrders;
