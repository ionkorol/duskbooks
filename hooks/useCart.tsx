import { useRouter } from "next/router";
import { useState } from "react";
import firebaseClient from "utils/firebaseClient";
import { CartItemProp } from "utils/interfaces";
import { toast } from "react-toastify";

const useCart = (cartId: string) => {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const addOrChangeItem = async (itemId: string, quantity: number) => {
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
        }),
      });
      toast.success("Item Added!");
    } catch (error) {
      setError(error);
      toast.error(error.message);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });
      toast.success("Item Removed!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const clearCart = async () => {
    try {
      await fetch("/api/cart", {
        method: "DELETE",
      });
      toast.success("Cart Cleared");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return {
    addOrChangeItem,
    removeItem,
    clearCart,
    error,
  };
};

export default useCart;
