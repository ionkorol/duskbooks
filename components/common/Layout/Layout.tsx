import React from "react";
import { Header, Navigation } from "components/common";

import styles from "./Layout.module.scss";
import Head from "next/head";

interface Props {
  small?: boolean;
  title: string;
}

const Layout: React.FC<Props> = (props) => {
  const { small, title } = props;
  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
      </Head>
      <Header small={small} />
      <Navigation />
      <div className={styles.mainContainer}>{props.children}</div>
      <div className={styles.footer}>Copyright @ duskbooks.com</div>
    </div>
  );
};

export default Layout;
