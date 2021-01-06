import React, { useRef, useEffect, useState } from "react";
import { useCompRender } from "hooks";
import { AddressProp, BookDataProp, FirebaseUserProp } from "utils/interfaces";
import { onRun } from "./functions";

interface Props {
  onPaid: () => any;
  itemsData: { quantity: number; data: BookDataProp }[];
  billingAddress: AddressProp;
  shippingAddress: AddressProp;
  userData: FirebaseUserProp;
}

const Paypal: React.FC<Props> = (props) => {
  const {
    onPaid,
    itemsData,
    billingAddress,
    shippingAddress,
    userData,
  } = props;

  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paypal = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_API_KEY}`;
    //For head
    document.head.appendChild(script);
    script.onload = () => {
      onRun(
        shippingAddress,
        billingAddress,
        itemsData,
        userData,
        onPaid,
        paypal
      );
    };
  }, []);

  useCompRender(() => {});

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
};

export default Paypal;
