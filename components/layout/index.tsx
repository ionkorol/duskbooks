import React from "react";
import { Header } from "../";
import Navigation from "../navigation";
import styles from "./layout.module.scss";

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
    </div>
  );
};

export default Layout;
