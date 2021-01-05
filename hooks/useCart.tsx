import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import firebaseClient from "../utils/firebaseClient";
import { CartItemProp } from "../utils/interfaces";

const useCart = (cartId: string) => {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const getItems = async () => {
    const cartItemsRef = firebaseClient
      .firestore()
      .collection("shoppingCarts")
      .doc(cartId)
      .collection("items");

    try {
      let items = [];
      const cartSnap = await cartItemsRef.get();
      for (const itemSnap of cartSnap.docs) {
        const itemData = itemSnap.data() as CartItemProp;
        console.log(itemData.ref.id);
        const prodData = (
          await firebaseClient
            .firestore()
            .collection("products")
            .doc(itemData.ref.id)
            .get()
        ).data();
        items.push({
          quantity: itemData.quantity,
          data: prodData,
        });
      }
      return items;
    } catch (error) {
      return error;
    }
  };

  const addItem = async (itemId: string) => {
    if (!cartId) {
      router.push("/auth");
    }
    try {
      const cartItemsRef = firebaseClient
        .firestore()
        .collection("shoppingCarts")
        .doc(cartId)
        .collection("items");

      const itemSnap = await cartItemsRef.doc(itemId).get();
      if (itemSnap.exists) {
        itemSnap.ref.update({
          quantity: firebaseClient.firestore.FieldValue.increment(1),
        });
      } else {
        itemSnap.ref.set({
          quantity: 1,
          ref: firebaseClient.firestore().collection("products").doc(itemId),
        });
      }
    } catch (error) {
      setError(error);
    }
  };

  const removeItem = async (itemId: string) => {
    const cartItemsRef = firebaseClient
      .firestore()
      .collection("shoppingCarts")
      .doc(cartId)
      .collection("items");
    try {
      await cartItemsRef.doc(itemId).delete();
      return true;
    } catch (error) {
      return false;
    }
  };

  const changeItemQuantity = async (itemId: string, itemQuantity: number) => {
    const cartItemRef = firebaseClient
      .firestore()
      .collection("shoppingCarts")
      .doc(cartId)
      .collection("items")
      .doc(itemId);
    try {
      await cartItemRef.update({
        quantity: itemQuantity,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const itemsQuery = await firebaseClient
        .firestore()
        .collection("shoppingCarts")
        .doc(cartId)
        .collection("items")
        .get();
      for (const item of itemsQuery.docs) {
        await item.ref.delete();
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    console.log(error);
  }, [error]);

  return {
    addItem,
    removeItem,
    clearCart,
    changeItemQuantity,
    getItems,
    error,
  };
};

export default useCart;
