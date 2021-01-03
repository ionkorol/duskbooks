import { useState } from "react";
import { AddressProp } from "../../../utils/interfaces";
import { AddressForm } from "../";

interface Props {}

const ShippingAddress: React.FC<Props> = (props) => {
  const [shippingInfo, setShippingInfo] = useState<AddressProp>(null);

  const onSubmit = () => {};

  return (
    <>
      <AddressForm
        title="Billing Information"
        setAddressInfo={setShippingInfo}
        onSubmit={onSubmit}
      />
      <button>Payment Info</button>
    </>
  );
};

export default ShippingAddress;
