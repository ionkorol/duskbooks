import React, { useRef, useEffect, useState } from "react";
import {
  AddressProp,
  BookDataProp,
  FirebaseUserProp,
} from "../../utils/interfaces";
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
    onRun(shippingAddress, billingAddress, itemsData, userData, onPaid, paypal);
  }, []);

  return (
    <div>
      <script src="https://www.paypal.com/sdk/js?client-id=AVazpM2HJg_XaoHT7TILEidPA_oPWiMxraxt8tufbxCGVu5JlK1S31zZxez1g5AzeXF6PBPKC17lNcVy" />
      <div ref={paypal}></div>
    </div>
  );
};

export default Paypal;
