import AddressForm from "../AddressForm";

interface Props {}

const BillingAddress: React.FC<Props> = (props) => {
  return (
    <>
      <AddressForm title="Billing Information" />
      <button>Shipping Information</button>
    </>
  );
};

export default BillingAddress;
