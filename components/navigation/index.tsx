import React, { useEffect, useState } from "react";
import { useCart } from "../../hooks";
import Button from "../button";
import firebaseClient from "../../utils/firebaseClient";

import styles from "./navigation.module.scss";
import Link from "next/link";

interface Props {}

const Navigation: React.FC<Props> = (props) => {
  const [cartPrice, setCartPrice] = useState(0);
  const [languages, setLanguages] = useState<string[]>([]);

  const calculateTotalPrice = (items) => {
    setCartPrice(0);
    items.forEach((item) => {
      const itemPrice = item.quantity * item.data.price;
      setCartPrice((prevState) => prevState + itemPrice);
    });
  };

  const getLanguages = async () => {
    const res = await fetch("http://127.0.0.1:5000/languages", {
      mode: "cors",
    });
    console.log(res);

    const jsonData = await res.json();
    setLanguages(jsonData.languages);
  };

  useEffect(() => {
    const unsub = firebaseClient
      .firestore()
      .collection("shoppingCart")
      .doc("9ULTo0HInqi3DZYJdePf")
      .collection("items")
      .onSnapshot((itemsSnap) => {
        const itemList = itemsSnap.docs.map((item) => item.data());
        calculateTotalPrice(itemList);
      });

    return () => unsub();
  }, []);

  useEffect(() => {
    getLanguages();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        {languages.map((language) => (
          <Link href={`/${language.toLocaleLowerCase()}`} passHref key={language}>
            <a className={styles.link}>{language}</a>
          </Link>
        ))}
      </div>
      <div className={styles.cart}>
        <Button>
          <div>$ {cartPrice}</div>
          <div>Cart</div>
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
