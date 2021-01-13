import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import styles from "./Layout.module.scss";

interface Props {}

const AdminLayout: React.FC<Props> = (props) => {
  const router = useRouter();

  const link: any = "users";

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <h1>DuskBooks</h1>
        <Link href="/dusk-admin" passHref>
          <a
            className={`${styles.menuItem} ${
              link === "dashboard" && styles.active
            }`}
          >
            Dashboard
          </a>
        </Link>
        <Link href="/dusk-admin/users" passHref>
          <a
            className={`${styles.menuItem} ${
              link === "users" && styles.active
            }`}
          >
            Users
          </a>
        </Link>
        <Link href="/dusk-admin/orders" passHref>
          <a
            className={`${styles.menuItem} ${
              link === "orders" && styles.active
            }`}
          >
            Orders
          </a>
        </Link>
      </div>
      <div className={styles.body}>{props.children}</div>
    </div>
  );
};

export default AdminLayout;
