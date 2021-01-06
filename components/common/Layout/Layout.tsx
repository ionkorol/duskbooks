import React from "react";
import { Header, Navigation } from "components/common";
import styles from "./Layout.module.scss";

interface Props {
  small?: boolean;
}

const Layout: React.FC<Props> = (props) => {
  const { small } = props;
  return (
    <div className={styles.container}>
      <Header small={small} />
      <Navigation />
      <div className={styles.mainContainer}>{props.children}</div>
      <div className={styles.footer}>Copyright @ duskbooks.com</div>
    </div>
  );
};

export default Layout;
