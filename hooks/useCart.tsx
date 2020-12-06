import { useState } from "react";
import firebaseClient from "../utils/firebaseClient";
import { ItemDataProp } from "../utils/interfaces";

const useCart = () => {
  const [error, setError] = useState<string | null>(null);

  const getItems = async (cartId: string) => {
    const cartItemsRef = firebaseClient
      .firestore()
      .collection("shoppingCart")
      .doc(cartId)
      .collection("items");

    try {
      const cartSnap = await cartItemsRef.get();
      return cartSnap.docs.map((item) => item.data());
    } catch (error) {
      return error;
    }
  };

  const addItem = async (itemData: ItemDataProp, cartId: string) => {
    const cartItemsRef = firebaseClient
      .firestore()
      .collection("shoppingCart")
      .doc(cartId)
      .collection("items");

    const itemSnap = await cartItemsRef.doc(itemData.isbn).get();
    if (itemSnap.exists) {
      itemSnap.ref.update({
        quantity: firebaseClient.firestore.FieldValue.increment(1),
      });
    } else {
      itemSnap.ref.set({
        quantity: 1,
        data: itemData,
      });
    }
  };

  const removeItem = async (itemId: string, cartId: string) => {
    const cartItemsRef = firebaseClient
      .firestore()
      .collection("shoppingCart")
      .doc(cartId)
      .collection("items");
    try {
      await cartItemsRef.doc(itemId).delete();
      return true;
    } catch (error) {
      return false;
    }
  };

  const changeItemQuantity = async (
    itemId: string,
    itemQuantity: number,
    cartId: string
  ) => {
    const cartItemRef = firebaseClient
      .firestore()
      .collection("shoppingCart")
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

  return { addItem, removeItem, changeItemQuantity, getItems, error };
};

export default useCart;
