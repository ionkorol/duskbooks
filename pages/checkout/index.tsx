import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Layout, Paypal } from "../../components";
import { useCart } from "../../hooks";
import firebaseAdmin from "../../utils/firebaseAdmin";
import {
  BookDataProp,
  FirebaseUserProp,
  OrderInProp,
} from "../../utils/interfaces";
import styles from "./Checkout.module.scss";
import firebaseClient from "../../utils/firebaseClient";
import nookies from "nookies";
import { AddressForm, MiniCart } from "../../components/checkout";
import { Form } from "react-bootstrap";
import { CreateOrderObj } from "../../components/paypal/interfaces";

interface Props {
  itemsData: { quantity: number; data: BookDataProp }[];
  userData: FirebaseUserProp;
  uid: string;
}

const Checkout: React.FC<Props> = (props) => {
  const { itemsData, userData, uid } = props;

  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [billingAddressError, setBillingAddressErrors] = useState({
    firstName: null,
    lastName: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    zip: null,
    country: null,
  });
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [shippingAddressErrors, setShippingAddressErrors] = useState({
    firstName: null,
    lastName: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    zip: null,
    country: null,
  });

  const [sameShipping, setSameShipping] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  const [paymentType, setPaymentType] = useState<"Paypal" | "Card">("Paypal");
  const [page, setPage] = useState<"shipping" | "billing" | "payment">(
    "shipping"
  );

  const cart = useCart(uid);
  const router = useRouter();

  const shippingForm = useRef(null);
  const billingForm = useRef(null);

  const onPaid = async () => {
    // Calculate Total Price
    let totalPrice = 0;
    itemsData.forEach(
      (item) => (totalPrice += item.quantity * item.data.salePrice)
    );

    try {
      // Get Last Order Id
      const lastOrderQuery = await firebaseClient
        .firestore()
        .collection("orders")
        .orderBy("id", "desc")
        .limit(1)
        .get();
      const lastOrderId = lastOrderQuery.docs[0].data().id;

      // Add Order Details to the DB
      await firebaseClient
        .firestore()
        .collection("orders")
        .doc(String(lastOrderId + 1))
        .set({
          id: lastOrderId + 1,
          lineItems: [
            ...itemsData.map((item) => ({
              quantity: item.quantity,
              data: item.data,
            })),
          ],
          totalPrice: totalPrice,
          userId: "Pdxel9Q7uMXY1q2R6WmkS3aBkhB3",
          createdAt: firebaseClient.firestore.FieldValue.serverTimestamp(),
          fulfillmentStatus: "Processing",
          shippingAddress: shippingAddress,
          billingAddress: billingAddress,
          paymentMethod: paymentType,
        } as OrderInProp);

      // Clear Cart
      cart.clearCart();
      // Redirect to Account
      router.push("/account");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(shippingAddress);
    console.log(billingAddress);
  }, [shippingAddress, billingAddress]);

  useEffect(() => {
    if (sameShipping) {
      setBillingAddress(shippingAddress);
    }
  }, [sameShipping, shippingAddress]);

  const onShippingSubmit = () => {
    setPage("billing");
  };

  const onBillingSubmit = () => {
    setPage("payment");
  };

  return (
    <Layout small>
      <script src="https://www.paypal.com/sdk/js?client-id=AVazpM2HJg_XaoHT7TILEidPA_oPWiMxraxt8tufbxCGVu5JlK1S31zZxez1g5AzeXF6PBPKC17lNcVy" />
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          {page === "shipping" ? (
            <AddressForm
              title="Shipping Information"
              disabled={false}
              setAddressInfo={setShippingAddress}
              addressInfo={shippingAddress}
              addressError={shippingAddressErrors}
              setAddressError={setShippingAddressErrors}
              onSubmit={onShippingSubmit}
            />
          ) : page === "billing" ? (
            <>
              <div
                className={styles.backButton}
                onClick={() => setPage("shipping")}
              >{`<- Back`}</div>
              <Form>
                <Form.Check
                  type="checkbox"
                  label="Shipping address is the same as my billing address"
                  checked={sameShipping}
                  onChange={(e) => setSameShipping(!sameShipping)}
                />
                <Form.Check
                  type="checkbox"
                  label="Save this information for next time"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(!saveInfo)}
                />
              </Form>
              <AddressForm
                title="Billing Information"
                disabled={sameShipping}
                addressInfo={billingAddress}
                setAddressInfo={setBillingAddress}
                addressError={billingAddressError}
                setAddressError={setBillingAddressErrors}
                onSubmit={onBillingSubmit}
              />
            </>
          ) : (
            <>
              <div
                className={styles.backButton}
                onClick={() => setPage("billing")}
              >{`<- Back`}</div>

              <Paypal
                onPaid={onPaid}
                billingAddress={billingAddress}
                shippingAddress={shippingAddress}
                userData={userData}
                itemsData={itemsData}
              />
            </>
          )}
        </div>
        <div className={styles.rightContainer}>
          <MiniCart cart={cart} />
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;

    if (!email) {
      ctx.res.writeHead(302, { Location: "/auth/signin" });
      ctx.res.end();

      return { props: {} as never };
    }

    const userData = (
      await firebaseAdmin.firestore().collection("users").doc(uid).get()
    ).data();

    // FETCH STUFF HERE!! 🚀

    let itemsData = [];
    const itemsSnap = await firebaseAdmin
      .firestore()
      .collection("shoppingCarts")
      .doc(uid)
      .collection("items")
      .get();
    const items = itemsSnap.docs;
    for (const item of items) {
      const itemData = item.data() as {
        quantity: number;
        ref: firebaseAdmin.firestore.DocumentReference;
      };
      const prodData = (await itemData.ref.get()).data();

      itemsData.push({
        quantity: itemData.quantity,
        data: prodData,
      });
    }

    return {
      props: {
        itemsData: itemsData,
        userData: userData ? userData : null,
        uid,
      },
    };
  } catch (error) {
    return {
      props: {
        error: JSON.stringify(error),
      },
    };
  }
};
