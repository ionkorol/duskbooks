import { useRouter } from "next/router";
import { useState } from "react";
import firebaseClient from "../utils/firebaseClient";
import { CartItemProp } from "../utils/interfaces";
import { toast } from "react-toastify";

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
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: cartId,
          itemId,
        }),
      });
      const jsonData = await res.json();
      if (jsonData.status) {
        toast.success("Item Added!");
        return true;
      } else {
        toast.error(jsonData.error);
        return false;
      }
    } catch (error) {
      setError(error);
      toast.error(error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch("/api/cart/items", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: cartId,
          itemId,
        }),
      });
      const jsonData = await res.json();
      if (jsonData.status) {
        toast.success("Item Removed!");
        return true;
      } else {
        toast.error(jsonData.error);
        return false;
      }
    } catch (error) {
      toast.error(error);
      return false;
    }
  };

  const changeItemQuantity = async (itemId: string, itemQuantity: number) => {
    try {
      const res = await fetch("/api/cart/items", {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: cartId,
          itemId,
          quantity: itemQuantity,
        }),
      });
      const jsonData = await res.json();
      if (jsonData.status) {
        toast.success("Quantity Changed!");
        return true;
      } else {
        toast.error(jsonData.error);
        return false;
      }
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
