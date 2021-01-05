import Link from "next/link";
import React from "react";
import { BookShelf, Navigation } from "../";
import { useAuth } from "../../hooks";

import styles from "./header.module.scss";

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
  console.log(auth.user);
  return (
    <div className={styles.topMenu}>
      <div className={styles.logo}>
        <Link href="/">DuskBooks</Link>
      </div>
      <div>
        <Link href="/">Home</Link>
        {!!auth.user && !!auth.user.data ? (
          <Link href="/account">
            <a>My Account</a>
          </Link>
        ) : (
          <>
            <Link href="/auth/signin">SIGN IN</Link>
            <Link href="/auth/signup">SIGN UP</Link>
          </>
        )}
        <Link href="/about">About Us</Link>
        <Link href="/contact">Contact Us</Link>
      </div>
    </div>
  );
};

export default Header;
