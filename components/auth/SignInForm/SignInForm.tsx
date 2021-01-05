import React, { FormEvent, useState } from "react";
import { Form } from "react-bootstrap";
import { useAuth, useCompUpdate } from "../../../hooks";

interface Props {}

const SignInForm: React.FC<Props> = (props) => {
  const [signIn, setSignIn] = useState({
    email: "",
    password: "",
  });
  const [signInError, setSignInError] = useState({
    email: null,
    password: null,
  });

  const [formValidated, setFormValidated] = useState(true);

  const auth = useAuth();

  const emailValidation = () => {
    if (!signIn.email) {
      setSignInError((prevState) => ({
        ...prevState,
        email: "Email cannot be empty!",
      }));
      return false;
    } else {
      setSignInError((prevState) => ({
        ...prevState,
        email: null,
      }));
      return true;
    }
  };

  const passwordValidation = () => {
    if (!signIn.password) {
      setSignInError((prevState) => ({
        ...prevState,
        password: "Password cannot be empty!",
      }));
      return false;
    } else {
      setSignInError((prevState) => ({
        ...prevState,
        password: null,
      }));
      return true;
    }
  };

  useCompUpdate(() => {
    emailValidation();
  }, [signIn.email]);
  useCompUpdate(() => {
    passwordValidation();
  }, [signIn.password]);

  const formValidation = () => {
    var result = true;

    result = emailValidation();
    result = passwordValidation();

    setFormValidated(result);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formValidation();
    if (formValidated) {
      auth.signIn(signIn.email, signIn.password);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email ..."
          value={signIn.email}
          onChange={(e) =>
            setSignIn((prevState) => ({
              ...prevState,
              email: e.target.value,
            }))
          }
          isInvalid={!!signInError.email}
          required
        />
        <Form.Control.Feedback type="invalid">
          {signInError.email}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your password ..."
          value={signIn.password}
          onChange={(e) =>
            setSignIn((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
          isInvalid={!!signInError.password}
          required
        />
        <Form.Control.Feedback type="invalid">
          {signInError.password}
        </Form.Control.Feedback>
      </Form.Group>
      <button type="submit">Log In</button>
    </Form>
  );
};

export default SignInForm;
