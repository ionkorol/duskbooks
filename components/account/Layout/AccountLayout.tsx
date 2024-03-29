import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "components/common";
import { useAuth } from "hooks";

import styles from "./AccountLayout.module.scss";

interface Props {}

const AccountLayout: React.FC<Props> = (props) => {
  const router = useRouter();

  const auth = useAuth();
  const pathArray = router.pathname.split("/");

  return (
    <Layout title="My Account | DuskBooks.com" small>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.profile}>
            {auth.user && auth.user.firstName} {auth.user && auth.user.lastName}
          </div>
          <div className={styles.menu}>
            <Link href="/account" passHref>
              <a
                className={`${styles.menuItem} ${
                  pathArray.length === 2 && styles.active
                }`}
              >
                General
              </a>
            </Link>
            <Link href="/account/orders" passHref>
              <a
                className={`${styles.menuItem} ${
                  pathArray.includes("orders") && styles.active
                }`}
              >
                Orders
              </a>
            </Link>
            <a href="#" className={styles.menuItem} onClick={auth.signOut}>
              Log Out
            </a>
          </div>
        </div>
        <div className={styles.main}>{props.children}</div>
      </div>
    </Layout>
  );
};

export default AccountLayout;
