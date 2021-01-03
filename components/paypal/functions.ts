import firebaseClient from "../../utils/firebaseClient";
import {
  AddressProp,
  BookDataProp,
  FirebaseUserProp,
} from "../../utils/interfaces";
import { CreateOrderObj } from "./interfaces";

export const onRun = async (
  shippingAddress: AddressProp,
  billingAddress: AddressProp,
  itemsData: { quantity: number; data: BookDataProp }[],
  userData: FirebaseUserProp,
  onPaid: () => any,
  paypal: React.MutableRefObject<any>
) => {
  let totalPrice = 0;
  itemsData.forEach(
    (item) => (totalPrice += item.quantity * item.data.salePrice)
  );

  const lastOrderQuery = await firebaseClient
    .firestore()
    .collection("orders")
    .orderBy("id", "desc")
    .limit(1)
    .get();
  const orderId = lastOrderQuery.docs[0].data().id + 1;

  console.log(billingAddress, shippingAddress);

  const paypalCreateOrderOptions: CreateOrderObj = {
    intent: "CAPTURE",
    payer: {
      name: {
        given_name: billingAddress.firstName,
        surname: billingAddress.lastName,
      },
      email_address: userData.email,
      address: {
        address_line_1: billingAddress.address1,
        address_line_2: billingAddress.address2,
        admin_area_2: billingAddress.city,
        admin_area_1: billingAddress.state,
        postal_code: billingAddress.zip,
        country_code: "US",
      },
    },
    purchase_units: [
      {
        amount: {
          value: (totalPrice + 3.99).toFixed(2),
          currency_code: "USD",
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: totalPrice.toFixed(2),
            },
            shipping: {
              currency_code: "USD",
              value: "3.99",
            },
          },
        },
        invoice_id: String(orderId),
        items: itemsData.map((item) => ({
          name: item.data.title,
          unit_amount: {
            currency_code: "USD",
            value: String(item.data.salePrice),
          },
          quantity: String(item.quantity),
          sku: item.data.isbn13,
          category: "PHYSICAL_GOODS",
        })),
        shipping: {
          name: {
            full_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          },
          address: {
            address_line_1: shippingAddress.address1,
            address_line_2: shippingAddress.address2,
            admin_area_2: shippingAddress.city,
            admin_area_1: shippingAddress.state,
            postal_code: shippingAddress.zip,
            country_code: "US",
          },
        },
      },
    ],
    application_context: {
      brand_name: "DuskBooks",
    },
  };

  (window as any).paypal
    .Buttons({
      createOrder: function (data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create(paypalCreateOrderOptions);
      },
      onApprove: function (data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function (details) {
          // Run stuff after successful payment
          onPaid();
          console.log(details);
        });
      },
      onError: function (error) {
        console.log(error);
      },
    })
    .render(paypal.current);
  console.log("Ran");
};
