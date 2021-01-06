import React from "react";
import { Header, Navigation } from "components/common";

import styles from "./Layout.module.scss";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

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
      <div className={styles.footer}>
        <div className={styles.contactInfo}>
          <h1>Contact Info</h1>
          <div>
            <FontAwesomeIcon icon={faMapMarkerAlt} size="1x" fixedWidth />
            1096 Church Street Sugar Hill, GA 30518
          </div>
          <div>
            <FontAwesomeIcon icon={faEnvelope} size="1x" fixedWidth />
            <a href="mailto:contact@duskbooks.com">contact@duskbooks.com</a>
          </div>
        </div>
        <div className={styles.about}>
          <h1>DuskBooks</h1>
          <div className={styles.descr}>
            We are here to help. If you have any question's don't hesitate to
            reach out to us.
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        © 2021 DuskBooks.com. All rights reserved. |{" "}
        <Link href="/policy/tos">Terms of Service Policy</Link> |{" "}
        <Link href="/policy/privacy">Privacy Policy</Link> |{" "}
        <Link href="/policy/return">Return and Refund Policy</Link>
      </div>
    </div>
  );
};

export default Layout;
