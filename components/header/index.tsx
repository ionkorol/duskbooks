import React from "react";
import { BookShelf, Navigation } from "../";
import { useAuth } from "../../hooks";

import styles from "./header.module.scss";

interface Props {
  small?: boolean;
}

const Header: React.FC<Props> = (props) => {
  const { small } = props;

  const auth = useAuth();

  const userJSX = () => {
    return (
      <>
        {auth.user ? (
          <span>
            Hello, <span style={{ color: "orange" }}>{auth.user.name}</span>
          </span>
        ) : (
          <>
            <a href="/auth/signin">SIGN IN</a> OR{" "}
            <a href="/auth/signup">SIGN UP</a>
          </>
        )}
      </>
    );
  };

  const formJSX = () => {
    return (
      <form>
        <input type="text" placeholder="Search Book ..." />
        <button
          type="submit"
        >
          Search
        </button>
      </form>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.topMenu}>
        <div>
          <a href="#">Find A Store</a>
          <a href="#">Help</a>
        </div>
        <div>
          {small ? userJSX() : null}
          <a href="#">About Us</a>
          <a href="#">Blog</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
      <div className={`${styles.logo} ${small ? styles.small : null}`}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Dusk_TV.svg/1280px-Dusk_TV.svg.png"
          alt="logo"
          width={200}
          height={50}
        />
        {small ? <div className={styles.search}>{formJSX()}</div> : null}
        {small ? null : userJSX()}
      </div>
      {small ? null : <div className={styles.search}>{formJSX()}</div>}
      {small ? null : (
        <div className={styles.bestSellers}>
          <BookShelf />
        </div>
      )}
    </div>
  );
};

export default Header;
