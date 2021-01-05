import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Layout } from "../../components";
import { useCompRender, useCompUpdate } from "../../hooks";
import firebaseAdmin from "../../utils/firebaseAdmin";
import { FirebaseUserProp } from "../../utils/interfaces";
import nookies from "nookies";

import styles from "./Contact.module.scss";

interface Props {
  uid: string;
  userData: FirebaseUserProp;
}

const Contact: React.FC<Props> = (props) => {
  const { uid, userData } = props;

  return (
    <Layout>
      <h2 className={styles.title}>Contact Us</h2>

      <div className={styles.container}>
        <div className={styles.formContainer}>
          <ContactForm userData={userData} />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.message}>
            We are here to help. If you have any question's don't hesitate to
            reach out to us.
          </div>
          <div className={styles.info}>
            <span className={styles.key}>Address: </span>
            <span className={styles.value}>
              <span>1096 Church Street</span>
              <span>Sugar Hill, GA 30518</span>
            </span>
            <span className={styles.key}>Email:</span>
            <span className={styles.value}>
              <a href="mailto:contact@duskbooks.com">contact@duskbooks.com</a>
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Contact;

interface CFProps {
  userData: FirebaseUserProp;
}

const ContactForm: React.FC<CFProps> = (props) => {
  const { userData } = props;
  console.log(userData);

  const [name, setName] = useState(
    userData ? userData.firstName + " " + userData.lastName : ""
  );
  const [nameError, setNameError] = useState(null);

  const [email, setEmail] = useState(userData ? userData.email : "");
  const [emailError, setEmailError] = useState(null);

  const [subject, setSubject] = useState("");
  const [subjectError, setSubjectError] = useState(null);

  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(null);

  const [formValidated, setFormValidated] = useState(true);

  useCompUpdate(() => {
    emptyValidation(name, setNameError);
  }, [name]);
  useCompUpdate(() => {
    emptyValidation(email, setEmailError);
  }, [email]);
  useCompUpdate(() => {
    emptyValidation(subject, setSubjectError);
  }, [subject]);
  useCompUpdate(() => {
    emptyValidation(message, setMessageError);
  }, [message]);

  const emptyValidation = (
    variable: string,
    errorSetter: React.Dispatch<any>
  ) => {
    if (!variable) {
      errorSetter("Input cannot be empty");
      return false;
    }
    errorSetter(null);
    return true;
  };

  const formValidation = () => {
    var result = true;
    result = emptyValidation(name, setNameError);
    result = emptyValidation(email, setEmailError);
    result = emptyValidation(subject, setSubjectError);
    result = emptyValidation(message, setMessageError);
    setFormValidated(result);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formValidation();
    if (formValidated) {
      console.log("Run");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isInvalid={!!nameError}
          required
        />
        <Form.Control.Feedback type="invalid">
          {nameError}
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
      <Form.Group>
        <Form.Label>Subject</Form.Label>
        <Form.Control
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          isInvalid={!!subjectError}
          required
        />
        <Form.Control.Feedback type="invalid">
          {subjectError}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {messageError}
        </Form.Control.Feedback>
      </Form.Group>
      <button className={styles.sendForm} type="submit">
        Send
      </button>
    </Form>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  var uid = null;
  var userData = null;
  if (cookies.token) {
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    uid = token.uid;
    userData = (
      await firebaseAdmin.firestore().collection("users").doc(uid).get()
    ).data();
  }

  return {
    props: {
      uid,
      userData,
    },
  };
};
