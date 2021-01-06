import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Form } from "react-bootstrap";
import { useCompUpdate } from "hooks";
import { UserWithOrdersProp } from "utils/interfaces";
import { AccountLayout } from "components/account";

import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

import styles from "./Account.module.scss";

interface Props {
  userData: UserWithOrdersProp;
}

const AccountGeneral: React.FC<Props> = (props) => {
  const { userData } = props;

  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [cPasswordError, setCPasswordError] = useState(null);

  const [formValidated, setFormValidated] = useState(true);

  useCompUpdate(() => {
    firstNameValidation();
  }, [firstName]);
  useCompUpdate(() => {
    lastNameValidation();
  }, [lastName]);
  useCompUpdate(() => {
    emailValidation();
  }, [email]);
  useCompUpdate(() => {
    passwordValidation();
  }, [password]);
  useCompUpdate(() => {
    cPasswordValidation();
  }, [cPassword]);

  const firstNameValidation = () => {
    if (!firstName) {
      setFirstNameError("First name has not been set!");
      return false;
    } else {
      setFirstNameError(null);
      return true;
    }
  };

  const lastNameValidation = () => {
    if (!lastName) {
      setLastNameError("Last name has not been set!");
      return false;
    } else {
      setLastNameError(null);
      return true;
    }
  };

  const emailValidation = () => {
    if (!email) {
      setEmailError("Email has not been set!");
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  const passwordValidation = () => {
    if (password) {
      if (password.length < 6) {
        setPasswordError("Password needs to be at least 6 characters long!");
        return false;
      } else if (!password.match("[0-9]")) {
        setPasswordError("Password needs to has at least one number!");
        return false;
      } else {
        setPasswordError(null);
        return true;
      }
    } else {
      setPasswordError(null);
      return true;
    }
  };

  const cPasswordValidation = () => {
    if (password && password !== cPassword) {
      setCPasswordError("Confirmation Password doesn't match!");
      return false;
    } else {
      setCPasswordError(null);
      return true;
    }
  };

  const formValidation = () => {
    var validated = true;
    validated = firstNameValidation();
    validated = lastNameValidation();
    validated = emailValidation();
    validated = passwordValidation();
    validated = cPasswordValidation();

    setFormValidated(validated);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formValidation();
    if (formValidated) {
      console.log("Test");
    }
  };

  return (
    <AccountLayout userData={userData}>
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
              isInvalid={!!firstNameError}
              required
            />
            <Form.Control.Feedback type="invalid">
              {firstNameError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              isInvalid={!!lastNameError}
              required
            />
            <Form.Control.Feedback type="invalid">
              {lastNameError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!emailError}
              required
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
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
          <button
            type="submit"
            disabled={
              firstNameError || lastNameError || emailError || passwordError
            }
          >
            Save Changes
          </button>
        </Form>
      </div>
    </AccountLayout>
  );
};

export default AccountGeneral;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;

    if (!email) {
      ctx.res.writeHead(302, { Location: "/auth" });
      ctx.res.end();
      return {
        props: {} as never,
      };
    }

    const userSnap = await firebaseAdmin
      .firestore()
      .collection("users")
      .doc(uid)
      .get();
    const userData = userSnap.data();

    const ordersQuery = await firebaseAdmin
      .firestore()
      .collection("orders")
      .where("userId", "==", userSnap.id)
      .get();

    const ordersData = ordersQuery.docs.map((order) => {
      const orderData = order.data();
      delete orderData.user;
      const date: Date = orderData.createdAt.toDate().toLocaleDateString();
      return {
        ...orderData,
        createdAt: date,
      };
    });

    return {
      props: {
        userData: {
          ...userData,
          orders: ordersData,
        },
      },
    };
  } catch (error) {
    ctx.res.writeHead(302, { Location: "/auth/signin" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
