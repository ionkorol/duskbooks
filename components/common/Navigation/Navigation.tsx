import React, { useEffect, useState } from "react";
import firebaseClient from "utils/firebaseClient";

import styles from "./Navigation.module.scss";
import Link from "next/link";
import { useAuth } from "hooks";
import { CartItemProp, ProductProp } from "utils/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

interface Props {}

const Navigation: React.FC<Props> = (props) => {
  const [cartPrice, setCartPrice] = useState(0);
  const [subjects, setSubjects] = useState<string[]>([]);

  const auth = useAuth();

  const calculateTotalPrice = (items: CartItemProp[]) => {
    setCartPrice(0);
    items.forEach((item) => {
      const itemPrice = item.quantity * item.data.salePrice;
      setCartPrice((prevState) => prevState + itemPrice);
    });
  };

  const getSubjects = async () => {
    const res = await fetch("/api/subjects");

    const jsonData = await res.json();
    setSubjects(jsonData.data);
  };

  // useEffect(() => {
  //   if (userId) {
  //     const unsub = firebaseClient
  //       .firestore()
  //       .collection("shoppingCarts")
  //       .doc(userId)
  //       .collection("items")
  //       .onSnapshot(async (itemsSnap) => {
  //         let itemsData = [];
  //         for (const item of itemsSnap.docs) {
  //           const itemData = item.data() as {
  //             quantity: number;
  //             ref: firebaseClient.firestore.DocumentReference;
  //           };
  //           const prodData = (
  //             await firebaseClient.firestore().doc(itemData.ref.path).get()
  //           ).data();
  //           itemsData.push({
  //             quantity: itemData.quantity,
  //             data: prodData,
  //           });
  //         }
  //         calculateTotalPrice(itemsData);
  //       });

  //     return () => unsub();
  //   }
  // }, []);

  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        {subjects.slice(0, 5).map((subject) => (
          <Link href={`/subject/${subject}`} key={subject} passHref>
            <a className={styles.link}>{subject}</a>
          </Link>
        ))}
      </div>
      <div className={styles.cart}>
        <Link href="/cart">
          <button>
            <div>$ {cartPrice.toFixed(2)}</div>
            <div>
              <FontAwesomeIcon icon={faCartPlus} fixedWidth />
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
