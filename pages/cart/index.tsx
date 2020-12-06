import { GetServerSideProps } from "next";
import React from "react";
import { Table } from "react-bootstrap";
import { Layout } from "../../components";
import firebaseAdmin from "../../utils/firebaseAdmin";

import styles from "./Cart.module.scss";

interface Props {
  cartItems: string;
}

const Cart: React.FC<Props> = (props) => {
  const { cartItems } = props;

  const cartItemss = JSON.parse(cartItems);
  return (
    <Layout small>
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
            {cartItemss.map((item) => (
              <tr key={item.data.isbn}>
                <td>
                  <img src="https://covers2.booksamillion.com/covers/bam/0/06/297/658/0062976583_b.jpg" alt="book name" width={50} height={50} />
                  {item.data.name}</td>
                <td>${item.data.price}</td>
                <td>{item.quantity}</td>
                <td>
                  <button style={{width: '50px'}}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const itemsSnap = await firebaseAdmin
    .firestore()
    .collection("shoppingCart")
    .doc("9ULTo0HInqi3DZYJdePf")
    .collection("items")
    .get();

  return {
    props: {
      cartItems: JSON.stringify(itemsSnap.docs.map((item) => item.data())),
    },
  };
};

export default Cart;
