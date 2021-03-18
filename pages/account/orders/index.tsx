import React from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { OrderProp } from "utils/interfaces";
import { Table } from "react-bootstrap";
import { AccountLayout } from "components/account";

import styles from "./Orders.module.scss";
import { isAuth } from "utils/functions";

interface Props {
  data: OrderProp[];
}

const AccountOrders: React.FC<Props> = (props) => {
  const { data } = props;
  console.log(data);

  return (
    <AccountLayout>
      <div className={styles.ordersContainer}>
        <Table striped hover>
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
            {data.map((order) => (
              <Link href={`/account/orders/${order.id}`} key={order.id}>
                <tr className={styles.order}>
                  <td># {order.id}</td>
                  <td>{new Date(order.createdAt * 1000).toDateString()}</td>
                  <td>{order.lineItems.length}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.fulfillmentStatus}</td>
                </tr>
              </Link>
            ))}
          </tbody>
        </Table>
      </div>
    </AccountLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const uid = await isAuth(ctx.req);

    const data = await (
      await fetch(`${process.env.SERVER}/api/users/${uid}/orders`)
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

export default AccountOrders;
