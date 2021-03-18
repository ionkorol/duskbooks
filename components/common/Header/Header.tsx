import Link from "next/link";
import React from "react";
import { Navigation } from "components/common";
import { useAuth } from "hooks";

import styles from "./Header.module.scss";
import { BookShelf } from "components/product";

interface Props {
  small?: boolean;
}

const Header: React.FC<Props> = (props) => {
  const { small } = props;

  return (
    <div className={styles.container}>
      <TopMenu />
      <SearchForm />

      {small ? null : (
        <div className={styles.bestSellers}>
          <BookShelf subject={"Fiction"} />
        </div>
      )}
    </div>
  );
};

const SearchForm = () => {
  return (
    <form className={styles.search}>
      <input type="text" placeholder="Search Book ..." />
      <button type="submit">Search</button>
    </form>
  );
};

const TopMenu = (props) => {
  const auth = useAuth();
  return (
    <div className={styles.topMenu}>
      <div className={styles.logo}>
        <Link href="/">DuskBooks</Link>
      </div>
      <div>
        <Link href="/">Home</Link>
        {auth.user ? (
          <Link href="/account">
            <a>My Account</a>
          </Link>
        ) : (
          <Link href="/auth">SIGN IN or SIGN UP</Link>
        )}
        <Link href="/about">About Us</Link>
        <Link href="/contact">Contact Us</Link>
      </div>
    </div>
  );
};

export default Header;
