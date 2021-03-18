import React, { useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useAuth, useCart } from "hooks";
import { CartItemProp, ProductProp, UserProp } from "utils/interfaces";
import { AddressForm, MiniCart, StripeForm } from "components/checkout";
import { Alert, Form } from "react-bootstrap";
import { Layout } from "components/common";

import styles from "./Checkout.module.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { isAuth } from "utils/functions";

interface Props {
  data: CartItemProp[];
}

const promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const Checkout: React.FC<Props> = (props) => {
  const { data } = props;

  console.log(data);

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
  const [paymentType, setPaymentType] = useState<"Paypal" | "Stripe">("Stripe");
  const [page, setPage] = useState<"shipping" | "billing" | "payment">(
    "shipping"
  );
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const cart = useCart(user && user.id);
  const router = useRouter();

  const onPaid = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lineItems: data,
          paymentMethod: paymentType,
          shippingAddress,
          billingAddress,
        }),
      });

      const orderId = (await res.json()).id;

      // Clear Cart
      cart.clearCart();

      // Redirect to Order
      router.push(`/account/orders/${orderId}`);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

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
    <Layout title="Checkout | DuskBooks.com" small>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <Alert variant="dangerous">{error}</Alert>
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

              <Elements stripe={promise}>
                <StripeForm onPaid={onPaid} data={data} />
              </Elements>
            </>
          )}
        </div>
        <div className={styles.rightContainer}>
          <MiniCart data={data} />
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;

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
