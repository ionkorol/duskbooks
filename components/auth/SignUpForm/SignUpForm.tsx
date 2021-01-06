import React, { FormEvent, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { useAuth, useCompUpdate } from "hooks";

interface Props {}

const SignUpForm: React.FC<Props> = (props) => {
  const [signUp, setSignUp] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cPassword: "",
  });
  const [signUpError, setSignUpError] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    cPassword: null,
  });

  const [formValidated, setFormValidated] = useState(true);
  const auth = useAuth();

  const firstNameValidation = () => {
    if (!signUp.firstName) {
      setSignUpError((prevState) => ({
        ...prevState,
        firstName: "First Name cannot be empty!",
      }));
      return false;
    } else {
      setSignUpError((prevState) => ({
        ...prevState,
        firstName: null,
      }));
      return true;
    }
  };

  const lastNameValidation = () => {
    if (!signUp.lastName) {
      setSignUpError((prevState) => ({
        ...prevState,
        lastName: "Last Name cannot be empty!",
      }));
      return false;
    } else {
      setSignUpError((prevState) => ({
        ...prevState,
        lastName: null,
      }));
      return true;
    }
  };

  const emailValidation = () => {
    if (!signUp.email) {
      setSignUpError((prevState) => ({
        ...prevState,
        email: "Email cannot be empty!",
      }));
      return false;
    } else {
      setSignUpError((prevState) => ({
        ...prevState,
        email: null,
      }));
      return true;
    }
  };

  const passwordValidation = () => {
    if (!signUp.password) {
      setSignUpError((prevState) => ({
        ...prevState,
        password: "Password cannot be empty!",
      }));
      return false;
    } else if (signUp.password.length < 6) {
      setSignUpError((prevState) => ({
        ...prevState,
        password: "Password must contain at least 6 characters!",
      }));
      return false;
    } else {
      setSignUpError((prevState) => ({
        ...prevState,
        password: null,
      }));
      return true;
    }
  };

  const cPasswordValidation = () => {
    if (signUp.password && signUp.cPassword !== signUp.password) {
      setSignUpError((prevState) => ({
        ...prevState,
        cPassword: "Passwords don't match!",
      }));
      return false;
    } else {
      setSignUpError((prevState) => ({
        ...prevState,
        cPassword: null,
      }));
      return true;
    }
  };

  useCompUpdate(() => {
    firstNameValidation();
  }, [signUp.firstName]);
  useCompUpdate(() => {
    lastNameValidation();
  }, [signUp.lastName]);
  useCompUpdate(() => {
    emailValidation();
  }, [signUp.email]);
  useCompUpdate(() => {
    passwordValidation();
  }, [signUp.password]);
  useCompUpdate(() => {
    cPasswordValidation();
  }, [signUp.cPassword]);

  const formValidation = () => {
    var result = true;
    result = firstNameValidation();
    result = lastNameValidation();
    result = emailValidation();
    result = passwordValidation();
    result = cPasswordValidation();

    setFormValidated(result);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formValidation();
    if (formValidated) {
      auth.signUp(
        signUp.firstName,
        signUp.lastName,
        signUp.email,
        signUp.password
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name ..."
              value={signUp.firstName}
              onChange={(e) =>
                setSignUp((prevState) => ({
                  ...prevState,
                  firstName: e.target.value,
                }))
              }
              isInvalid={!!signUpError.firstName}
              required
            />
            <Form.Control.Feedback type="invalid">
              {signUpError.firstName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name ..."
              value={signUp.lastName}
              onChange={(e) =>
                setSignUp((prevState) => ({
                  ...prevState,
                  lastName: e.target.value,
                }))
              }
              isInvalid={!!signUpError.lastName}
              required
            />
            <Form.Control.Feedback type="invalid">
              {signUpError.lastName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email ..."
          value={signUp.email}
          onChange={(e) =>
            setSignUp((prevState) => ({
              ...prevState,
              email: e.target.value,
            }))
          }
          isInvalid={!!signUpError.email}
          required
        />
        <Form.Control.Feedback type="invalid">
          {signUpError.email}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your password ..."
          value={signUp.password}
          onChange={(e) =>
            setSignUp((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
          isInvalid={!!signUpError.password}
          required
        />
        <Form.Control.Feedback type="invalid">
          {signUpError.password}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your password again ..."
          value={signUp.cPassword}
          onChange={(e) =>
            setSignUp((prevState) => ({
              ...prevState,
              cPassword: e.target.value,
            }))
          }
          isInvalid={!!signUpError.cPassword}
          required
        />
        <Form.Control.Feedback type="invalid">
          {signUpError.cPassword}
        </Form.Control.Feedback>
      </Form.Group>
      <button type="submit">Sign Up</button>
    </Form>
  );
};

export default SignUpForm;
