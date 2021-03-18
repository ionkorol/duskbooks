import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CartItemProp } from "utils/interfaces";
import { Button, Form, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";

import styles from "./StripeForm.module.scss";

interface Props {
  data: CartItemProp[];
  onPaid: () => void;
}

const StripeForm: React.FC<Props> = (props) => {
  const { data, onPaid } = props;

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: data }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setClientSecret(data.secret);
      });
  }, []);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      onPaid();
    }
  };

  return (
    <Form className={styles.form} onSubmit={handleSubmit}>
      <Form.Group>
        <CardElement
          className={styles.cardElement}
          options={cardStyle}
          onChange={handleChange}
        />
      </Form.Group>
      <Button disabled={processing || disabled || succeeded} type="submit">
        {processing ? (
          <div>
            <Spinner size="sm" animation="grow" />
            <Spinner size="sm" animation="grow" />
            <Spinner size="sm" animation="grow" />
            <Spinner size="sm" animation="grow" />
          </div>
        ) : (
          "Pay now"
        )}
      </Button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      {/* Show a success message upon completion */}
      {succeeded && <p className="text-success">Payment Was Successful</p>}
    </Form>
  );
};

export default StripeForm;
