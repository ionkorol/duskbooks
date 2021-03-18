import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Form } from "react-bootstrap";
import { useCompUpdate } from "hooks";
import { AccountLayout } from "components/account";

import styles from "./Account.module.scss";
import { isAuth } from "utils/functions";
import { UserProp } from "utils/interfaces";
import firebaseAdmin from "utils/firebaseAdmin";

interface Props {
  data: UserProp;
}

const AccountGeneral: React.FC<Props> = (props) => {
  const { data } = props;

  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Test");
  };

  return (
    <AccountLayout>
      <div className={styles.container}>
        <Form onSubmit={handleSubmit}>
          <h4>Personal Information</h4>
          <hr />
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          {/* <h4>Personal Information</h4>
          <hr />
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
              isInvalid={!!cPasswordError}
            />
            <Form.Control.Feedback type="invalid">
              {cPasswordError}
            </Form.Control.Feedback>
          </Form.Group> */}
          <button type="submit">Save Changes</button>
        </Form>
      </div>
    </AccountLayout>
  );
};

export default AccountGeneral;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const uid = await isAuth(ctx.req);
    const data = await (
      await fetch(`${process.env.SERVER}/api/users/${uid}`)
    ).json();

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
