import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { Layout } from "../../components";
import { useAuth } from "../../hooks";
import firebaseAdmin from "../../utils/firebaseAdmin";
import { OrderProp, UserWithOrdersProp } from "../../utils/interfaces";
import nookies from "nookies";
import styles from "./Account.module.scss";

interface Props {
  userData: UserWithOrdersProp;
}

const Account: React.FC<Props> = (props) => {
  const { userData } = props;
  const [selected, setSelected] = useState<"General" | "Orders">("General");
  const auth = useAuth();
  return (
    <Layout small>
      <h4 className={styles.title}>Account</h4>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.profile}>
            {userData.firstName} {userData.lastName}
          </div>
          <div className={styles.menu}>
            <div
              onClick={() => setSelected("General")}
              className={selected == "General" ? styles.active : null}
            >
              General
            </div>
            <div
              onClick={() => setSelected("Orders")}
              className={selected == "Orders" ? styles.active : null}
            >
              Orders
            </div>
            <div onClick={auth.signOut}>Log Out</div>
          </div>
        </div>
        <div className={styles.main}>
          {selected == "General" ? (
            <General userData={userData} />
          ) : (
            <Orders orders={userData.orders} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Account;

interface GeneralProps {
  userData: UserWithOrdersProp;
}

const General = (props) => {
  const { userData } = props;

  const [fName, setFName] = useState(userData.firstName);
  const [lName, setLName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const [fNameError, setFNameError] = useState("");
  const [lNameError, setLNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cPasswordError, setCPasswordError] = useState("");

  return (
    <form>
      <h4>Personal Information</h4>
      <hr />
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label>First Name</label>
          <input
            type="text"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            required
          />
          <div className={styles.invalidInput}>{fNameError}</div>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label>Last Name</label>
          <input
            type="text"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
            required
          />
          <div className={styles.invalidInput}>{lNameError}</div>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className={styles.invalidInput}>{emailError}</div>
        </div>
      </div>
      <h4>Change Password</h4>
      <hr />
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className={styles.invalidInput}>{passwordError}</div>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label>Confirm Password</label>
          <input
            type="text"
            value={cPassword}
            onChange={(e) => setCPassword(e.target.value)}
            required
          />
          <div className={styles.invalidInput}>{cPasswordError}</div>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <button type="submit">Send</button>
        </div>
      </div>
    </form>
  );
};

interface OrdersProps {
  orders: OrderProp[];
}

const Orders: React.FC<OrdersProps> = (props) => {
  const { orders } = props;
  console.log(orders);
  return (
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
          {orders.map((order) => (
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
