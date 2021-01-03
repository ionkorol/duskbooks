import React, { useState } from "react";
import { Layout } from "../../components";

import styles from "./Contact.module.scss";

interface Props {}

const Contact: React.FC<Props> = (props) => {
  return (
    <Layout>
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

const ContactForm = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const [subject, setSubject] = useState("");
  const [subjectError, setSubjectError] = useState(null);

  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(null);

  console.log(message);

  return (
    <form>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className={styles.invalidInput}>{nameError}</div>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className={styles.invalidInput}>{emailError}</div>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <div className={styles.invalidInput}>{subjectError}</div>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <label>Message</label>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <div className={styles.invalidInput}>{messageError}</div>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.inputGroup}>
          <button type="submit">Send</button>
        </div>
      </div>
    </form>
  );
};
