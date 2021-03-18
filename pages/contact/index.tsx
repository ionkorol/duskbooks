import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Layout } from "components/common";
import { useCompUpdate } from "hooks";
import { UserProp } from "utils/interfaces";
import { toast } from "react-toastify";

import styles from "./Contact.module.scss";

interface Props {}

const Contact: React.FC<Props> = (props) => {
  return (
    <Layout title="Contact Us | DuskBooks.com">
      <h2 className={styles.title}>Contact Us</h2>

      <div className={styles.container}>
        <div className={styles.formContainer}>
          <ContactForm />
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

interface CFProps {}

const ContactForm: React.FC<CFProps> = (props) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const [subject, setSubject] = useState("");
  const [subjectError, setSubjectError] = useState(null);

  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(null);

  const [formValidated, setFormValidated] = useState(true);

  const [sending, setSending] = useState(false);

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
      setSending(true);
      fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          from: email,
          subject,
          message: `${message}\n\nFrom: <${name}> ${email}`,
        }),
      })
        .then((data) => {
          toast.success("Email Sent");
          setSending(false);
          setSubject("");
          setMessage("");
          console.log("Email Info", data);
        })
        .catch((error) => {
          toast.error(error);
          setSending(false);
        });
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
      <button disabled={sending} className={styles.sendForm} type="submit">
        {sending ? "Sending..." : "Send"}
      </button>
    </Form>
  );
};
