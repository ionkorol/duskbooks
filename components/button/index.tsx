import React, { MouseEvent } from "react";
import Link from "next/link";

import styles from "./button.module.scss";

interface Props {
  href?: string;
  type?: "submit" | "reset";
  onClick?: any;
}

const Button: React.FC<Props> = (props) => {
  const { href, type, onClick } = props;
  return (
    <Link href={href ? href : "#"}>
      <button type={type} onClick={onClick}>
        {props.children}
      </button>
    </Link>
  );
};

export default Button;
